"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const account_service_1 = __importDefault(require("./account.service"));
const validate_request_1 = __importDefault(require("../_middleware/validate-request"));
const authorize_1 = __importDefault(require("../_middleware/authorize"));
const role_1 = __importDefault(require("../_helpers/role"));
const joi_1 = __importDefault(require("joi"));
const router = require('express').Router();
// Routes
router.post('/authenticate', authenticateSchema, authenticate);
router.post('/refresh-token', refreshToken);
router.post('/revoke-token', (0, authorize_1.default)(), revokeTokenSchema, revokeToken);
router.post('/register', registerSchema, register);
router.post('/verify-email', verifyEmailSchema, verifyEmail);
router.post('/forgot-password', forgotPasswordSchema, forgotPassword);
router.post('/reset-password', resetPasswordSchema, resetPassword);
router.get('/', (0, authorize_1.default)(role_1.default.Admin), getAll);
router.get('/:id', (0, authorize_1.default)(), getById);
router.post('/', (0, authorize_1.default)(role_1.default.Admin), createSchema, create);
router.put('/:id', (0, authorize_1.default)(), updateSchema, update);
router.delete('/:id', (0, authorize_1.default)(), _delete);
exports.default = router;
// Validation schemas
function authenticateSchema(req, res, next) {
    const schema = joi_1.default.object({
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().required()
    });
    (0, validate_request_1.default)(req, next, schema);
}
function authenticate(req, res, next) {
    const ipAddress = req.ip || req.socket.remoteAddress || '';
    account_service_1.default.authenticate({ ...req.body, ipAddress })
        .then((result) => {
        setTokenCookie(res, result.refreshToken);
        // Remove refreshToken from response body
        const { refreshToken, ...responseData } = result;
        res.json(responseData);
    })
        .catch(next);
}
function refreshToken(req, res, next) {
    const token = req.cookies.refreshToken || req.body.refreshToken;
    const ipAddress = req.ip || req.socket.remoteAddress || '';
    account_service_1.default.refreshToken({ token, ipAddress })
        .then((result) => {
        setTokenCookie(res, result.refreshToken);
        res.json(result);
    })
        .catch(next);
}
function revokeTokenSchema(req, res, next) {
    const schema = joi_1.default.object({
        token: joi_1.default.string().optional()
    });
    (0, validate_request_1.default)(req, next, schema);
}
function revokeToken(req, res, next) {
    const token = req.body.token || req.cookies.refreshToken;
    const ipAddress = req.ip || req.socket.remoteAddress || '';
    if (!token) {
        return res.status(400).json({ message: 'Token is required' });
    }
    account_service_1.default.revokeToken({ token, ipAddress })
        .then(() => res.json({ message: 'Token revoked' }))
        .catch(next);
}
function registerSchema(req, res, next) {
    const schema = joi_1.default.object({
        title: joi_1.default.string().required(),
        firstName: joi_1.default.string().required(),
        lastName: joi_1.default.string().required(),
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().min(6).required(),
        confirmPassword: joi_1.default.string().valid(joi_1.default.ref('password')).required()
    });
    (0, validate_request_1.default)(req, next, schema);
}
function register(req, res, next) {
    const origin = req.headers.origin || '';
    account_service_1.default.register(req.body, origin)
        .then(() => res.json({ message: 'Registration successful, please check your email for verification instructions' }))
        .catch(next);
}
function verifyEmailSchema(req, res, next) {
    const schema = joi_1.default.object({
        token: joi_1.default.string().required()
    });
    (0, validate_request_1.default)(req, next, schema);
}
function verifyEmail(req, res, next) {
    account_service_1.default.verifyEmail(req.body)
        .then(() => res.json({ message: 'Verification successful, you can now login' }))
        .catch(next);
}
function forgotPasswordSchema(req, res, next) {
    const schema = joi_1.default.object({
        email: joi_1.default.string().email().required()
    });
    (0, validate_request_1.default)(req, next, schema);
}
function forgotPassword(req, res, next) {
    const origin = req.headers.origin || '';
    account_service_1.default.forgotPassword(req.body, origin)
        .then(() => res.json({ message: 'Please check your email for password reset instructions' }))
        .catch(next);
}
function resetPasswordSchema(req, res, next) {
    const schema = joi_1.default.object({
        token: joi_1.default.string().required(),
        password: joi_1.default.string().min(6).required(),
        confirmPassword: joi_1.default.string().valid(joi_1.default.ref('password')).required()
    });
    (0, validate_request_1.default)(req, next, schema);
}
function resetPassword(req, res, next) {
    account_service_1.default.resetPassword(req.body)
        .then(() => res.json({ message: 'Password reset successful, you can now login' }))
        .catch(next);
}
function getAll(req, res, next) {
    account_service_1.default.getAll()
        .then((accounts) => res.json(accounts))
        .catch(next);
}
function getById(req, res, next) {
    const id = parseInt(req.params.id);
    const currentUser = req.user;
    if (id !== currentUser.id && currentUser.role !== role_1.default.Admin) {
        return res.status(403).json({ message: 'Forbidden' });
    }
    account_service_1.default.getById(id)
        .then((account) => res.json(account))
        .catch(next);
}
function createSchema(req, res, next) {
    const schema = joi_1.default.object({
        title: joi_1.default.string().required(),
        firstName: joi_1.default.string().required(),
        lastName: joi_1.default.string().required(),
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().min(6).required(),
        confirmPassword: joi_1.default.string().valid(joi_1.default.ref('password')).required(),
        role: joi_1.default.string().valid(role_1.default.Admin, role_1.default.User).optional()
    });
    (0, validate_request_1.default)(req, next, schema);
}
function create(req, res, next) {
    account_service_1.default.create(req.body)
        .then((account) => res.json(account))
        .catch(next);
}
function updateSchema(req, res, next) {
    const schema = joi_1.default.object({
        title: joi_1.default.string().empty(''),
        firstName: joi_1.default.string().empty(''),
        lastName: joi_1.default.string().empty(''),
        email: joi_1.default.string().email().empty(''),
        password: joi_1.default.string().min(6).empty(''),
        confirmPassword: joi_1.default.string().valid(joi_1.default.ref('password')).empty(''),
        role: joi_1.default.string().valid(role_1.default.Admin, role_1.default.User).empty('')
    });
    (0, validate_request_1.default)(req, next, schema);
}
function update(req, res, next) {
    const id = parseInt(req.params.id);
    const currentUser = req.user;
    if (id !== currentUser.id && currentUser.role !== role_1.default.Admin) {
        return res.status(403).json({ message: 'Forbidden' });
    }
    account_service_1.default.update(id, req.body)
        .then((account) => res.json(account))
        .catch(next);
}
function _delete(req, res, next) {
    const id = parseInt(req.params.id);
    const currentUser = req.user;
    if (id !== currentUser.id && currentUser.role !== role_1.default.Admin) {
        return res.status(403).json({ message: 'Forbidden' });
    }
    account_service_1.default.delete(id)
        .then(() => res.json({ message: 'Account deleted successfully' }))
        .catch(next);
}
// Helper function
function setTokenCookie(res, token) {
    const cookieOptions = {
        httpOnly: true,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        secure: false,
        sameSite: 'strict'
    };
    res.cookie('refreshToken', token, cookieOptions);
}
