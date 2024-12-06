const checkPermissions = async (resource, action) => {
    return async (req, res, next) => {
        const userId = req.user.userId;
        const userAccessQuery = '';

        if (userAccessQuery.rows.length > 0) {
            next();
        } else {
            res.status(403).json({ message: 'Access denied' });
        }
    }
}

module.exports = checkPermissions;