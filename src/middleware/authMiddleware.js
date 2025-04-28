import jwt from 'jsonwebtoken'

// Основной middleware для проверки авторизации
function authMiddleware(req, res, next) {
    const token = req.headers['authorization']

    if (!token) { return res.status(401).json({ message: "No token provided" }) }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) { return res.status(401).json({ message: "Invalid token" }) }

        req.userId = decoded.id
        req.userRole = decoded.role
        req.username = decoded.username
        next()
    })
}

// Middleware для проверки роли - только админы и суперпользователи
function adminMiddleware(req, res, next) {
    const token = req.headers['authorization']

    if (!token) { return res.status(401).json({ message: "No token provided" }) }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) { return res.status(401).json({ message: "Invalid token" }) }

        if (decoded.role !== 'admin' && decoded.role !== 'superuser') {
            return res.status(403).json({ message: "Requires admin privileges" })
        }

        req.userId = decoded.id
        req.userRole = decoded.role
        req.username = decoded.username
        next()
    })
}

// Middleware только для суперпользователя
function superuserMiddleware(req, res, next) {
    const token = req.headers['authorization']

    if (!token) { return res.status(401).json({ message: "No token provided" }) }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) { return res.status(401).json({ message: "Invalid token" }) }

        if (decoded.role !== 'superuser') {
            return res.status(403).json({ message: "Requires superuser privileges" })
        }

        req.userId = decoded.id
        req.userRole = decoded.role
        req.username = decoded.username
        next()
    })
}

export { authMiddleware, adminMiddleware, superuserMiddleware }
export default authMiddleware