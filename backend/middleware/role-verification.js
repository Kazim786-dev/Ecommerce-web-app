
const VerifyRole = ({roleToCheck}) => {
    return (req, res, next) => {
        const { role } = req.user.user; // Assuming user role is accessible this way
        
        if (role == roleToCheck) {
            next(); // Role matches, continue to the next middleware/route handler
        } else {
            res.status(403).json({ error: "Access denied. Insufficient privileges." });
        }
    };
};

export default VerifyRole;
