import sqlString from "sqlstring";
import queryAsync from "../utils/queryAsync.js";

export class MovieController {
  static async getMovies(req, res) {
    let { keyword, orderBy, sortBy } = req.query;

    let offset = Number(req.query.offset);
    let limit = Number(req.query.limit);
    offset = offset * limit;

    let whereQuery = " WHERE 1 = 1 ";

    if (keyword) {
      whereQuery += ` AND title LIKE '%${keyword}%' `;
    }

    let orderByQuery = " ";

    if (orderBy && sortBy) {
      orderByQuery = sqlString.format(` ORDER BY ${orderBy} ${sortBy} `);
    } else if (sortBy) {
      orderByQuery = sqlString.format(` ORDER BY createdAt ${sortBy} `);
    } else if (orderBy) {
      orderByQuery = sqlString.format(` ORDER BY ${orderBy} DESC `);
    } else {
      orderByQuery = sqlString.format(` ORDER BY createdAt DESC `);
    }

    let limitQuery = "";

    if (!isNaN(offset) && !isNaN(limit) && offset >= 0 && limit >= 0) {
      limitQuery = sqlString.format(` LIMIT ?, ? `, [offset, limit]);
    }

    let query =
      sqlString.format(
        `SELECT * FROM movies ${whereQuery} ${orderByQuery} ${limitQuery};`
      ) +
      sqlString.format(
        `SELECT 
          COUNT(*) AS totalRecords
        FROM
          movies
        ${whereQuery};`
      );

    let result = await queryAsync(query);

    if (result.error) {
      return res.json({
        success: false,
        message: "oops, try again later",
      });
    }

    let movies = result.result[0];

    let pageMeta = {
      totalRecords: result.result[1][0].totalRecords,
    };

    if (!isNaN(offset) && !isNaN(limit) && offset >= 0 && limit >= 0) {
      pageMeta.noOfPages = Math.ceil(pageMeta.totalRecords / limit);
      pageMeta.currentPage = Math.floor(offset / limit) + 1;
    } else {
      pageMeta.noOfPages = 1;
      pageMeta.currentPage = 1;
    }

    return res.json({
      success: true,
      movies,
      pageMeta,
    });
  }

  static async getMovie(req, res) {
    let movieId = req.params.movieId;

    let query = sqlString.format(`SELECT * FROM movies WHERE movieId = ?;`, [
      movieId,
    ]);

    let result = await queryAsync(query);

    if (result.error) {
      return res.json({
        success: false,
        message: "oops, try again later",
      });
    }

    let movie = result.result[0];

    return res.json({
      success: true,
      movie,
    });
  }

  static async createMovie(req, res) {
    let { title, description, thumbnail, videoSrc } = req.body;

    if (!title || !thumbnail || !videoSrc) {
      return res.json({
        success: false,
        message: "All fields are required",
      });
    }

    let query = sqlString.format(`INSERT INTO movies SET ?;`, {
      title,
      description,
      thumbnail,
      videoSrc,
    });

    let result = await queryAsync(query);

    if (result.error) {
      return res.json({
        success: false,
        message: "oops, try again later",
      });
    }

    return res.json({
      success: true,
      message: "Movie created successfully",
    });
  }

  static async updateMovie(req, res) {
    let movieId = req.params.movieId;
    let requestObj = req.body;
    let updateObj = {};

    if (requestObj.hasOwnProperty("title")) {
      if (!requestObj.title) {
        return res.json({
          success: false,
          message: "Title is required",
        });
      }

      updateObj.title = requestObj.title;
    }

    if (requestObj.hasOwnProperty("description")) {
      updateObj.description = requestObj.description;
    }

    if (requestObj.hasOwnProperty("thumbnail")) {
      if (!requestObj.thumbnail) {
        return res.json({
          success: false,
          message: "Thumbnail is required",
        });
      }

      updateObj.thumbnail = requestObj.thumbnail;
    }

    if (requestObj.hasOwnProperty("videoSrc")) {
      if (!requestObj.videoSrc) {
        return res.json({
          success: false,
          message: "Video source is required",
        });
      }

      updateObj.videoSrc = requestObj.videoSrc;
    }

    if (Object.keys(updateObj).length === 0) {
      return res.json({
        success: false,
        message: "No fields to update",
      });
    }

    let query = sqlString.format(`UPDATE movies SET ? WHERE movieId = ?;`, [
      updateObj,
      movieId,
    ]);

    let result = await queryAsync(query);

    if (result.error) {
      return res.json({
        success: false,
        message: "oops, try again later",
      });
    }

    return res.json({
      success: true,
      message: "Movie updated successfully",
    });
  }

  static async deleteMovie(req, res) {
    let movieId = req.params.movieId;

    let query = sqlString.format(`DELETE FROM movies WHERE movieId = ?;`, [
      movieId,
    ]);

    let result = await queryAsync(query);

    if (result.error) {
      return res.json({
        success: false,
        message: "oops, try again later",
      });
    }

    return res.json({
      success: true,
      message: "Movie deleted successfully",
    });
  }
}
