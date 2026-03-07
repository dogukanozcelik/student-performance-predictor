import sql from '../config/db.js'

export const test = async (req, res) => {
  try {
    console.log("deneme");

    const result = await sql`SELECT version()`;

    console.log(result);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};