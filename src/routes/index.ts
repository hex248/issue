import issueCreate from "./issue/create";
import issueDelete from "./issue/delete";
import issueUpdate from "./issue/update";
import issuesInProject from "./issues/[projectBlob]";
import issues from "./issues/all";

export const routes = {
    issueCreate,
    issueDelete,
    issueUpdate,
    issuesInProject,
    issues,
};
