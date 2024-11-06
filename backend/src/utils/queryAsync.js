import conn from "../config/db.js";
import sqlString from "sqlstring";

const queryAsync = async (query, values) => {
  try {
    return await new Promise((resolve, reject) => {
      let parsedQuery = sqlString.format(query, values);

      conn.query(parsedQuery, (error, result) => {
        if (error) {
          reject({
            error,
          });
        } else {
          resolve({ result });
        }
      });
    });
  } catch (error) {
    return {
      error,
    };
  }
};

export default queryAsync;
