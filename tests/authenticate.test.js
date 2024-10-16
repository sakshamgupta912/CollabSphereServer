const jwt = require('jsonwebtoken');
const authenticate = require('../middleware/authenticate');

describe('Authenticate Middleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            headers: {
                authorization: 'Bearer token'
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    it('should call next if the token is valid', () => {
        jwt.verify = jest.fn().mockReturnValue({ id: '123' });

        authenticate(req, res, next);

        expect(jwt.verify).toHaveBeenCalledWith('token', 'AzQPI!');
        expect(req.user).toEqual({ id: '123' });
        expect(next).toHaveBeenCalled();
    });

    it('should return 401 if the token is expired', () => {
        jwt.verify = jest.fn(() => { throw { name: 'TokenExpiredError' }; });

        authenticate(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'token Expired' });
    });

    it('should return 403 if the authentication fails', () => {
        jwt.verify = jest.fn(() => { throw new Error('Invalid token'); });

        authenticate(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: 'authentication failed' });
    });
});
