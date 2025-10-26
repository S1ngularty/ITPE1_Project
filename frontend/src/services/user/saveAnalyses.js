import axios from "axios";
import { getToken } from "../../utils/authUtil";
const recordRename = async (name, id) => {
  try {
    const result = axios.post(
      `${import.meta.env.VITE_APP_API}api/v1/saved/${id}`,
      { analysesName: name },
      {
        headers: { Authorization: `Bearer ${getToken()}` },
      }
    );
    if (result instanceof Error) throw new Error("something went wrong");
    return result;
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error,
    };
  }
};

export { recordRename };
