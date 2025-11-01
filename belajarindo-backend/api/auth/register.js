// Minimal replacement used for debugging deployment issues. This simple
// function ensures Vercel serves the file and returns JSON so we can
// confirm the route is mapped to this file. We'll restore full logic
// after verifying deployment.
module.exports = (req, res) => {
  return res.status(200).json({ ok: true, message: 'register function minimal responder — deployment verified' });
};
