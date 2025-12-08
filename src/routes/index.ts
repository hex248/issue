import issueCreate from "./issue/create";
import issueDelete from "./issue/delete";
import issueUpdate from "./issue/update";
import issuesInProject from "./issues/[projectBlob]";

export const routes = {
    issueCreate,
    issueDelete,
    issueUpdate,
    issuesInProject,
};
