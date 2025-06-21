export const getUserData = async (req, res) => {
  try {
    const role = req.user.role;

    const recentSearchedCities = req.user.recentSearchedCities;

    res.status(200).json({
      success: true,
      role,
      recentSearchedCities,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
