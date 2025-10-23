import axios from "axios";

const recordRename = async (data) => {
  axios
    .post(
      `${import.meta.env.VITE_APP_API}api/v1/saved/${id}`,
      { analysesName: "table screw analysis" },
      {
        headers: { Authorization: `Bearer ${getToken()}` },
      }
    )
    .then((response) => fetchSavedAnalyses())
    .catch((error) => console.log(error));
};

export { recordRename };
