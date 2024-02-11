export async function viewProfile(req, res) {
  try {
    const user = req.user;
    return res.json({ status: 200, user });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

export async function updateProfile(req, res) {
  try {
  } catch (error) {}
}
