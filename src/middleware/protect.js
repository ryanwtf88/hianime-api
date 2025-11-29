import { NotFoundError } from '../utils/errors.js';

const protect = async (c, next) => {
    try {
        const ip = c.req.header('X-Forwarded-For') ?? null;

        if (!ip) throw new NotFoundError('404 Page Not Found');

        await next();
    } catch (error) {
        throw new NotFoundError('404 Page Not Found');
    }
};

export default protect;
