import issueCreate from "./issue/create";
import issueDelete from "./issue/delete";
import issueUpdate from "./issue/update";
import issuesInProject from "./issues/[projectBlob]";
import issues from "./issues/all";

import projectCreate from "./project/create";
import projectUpdate from "./project/update";
import projectDelete from "./project/delete";
import projectsByOwner from "./project/by-owner";
import projectsAll from "./project/all";
import projectsWithOwners from "./project/with-owners";
import projectWithOwner from "./project/with-owner";

export const routes = {
    issueCreate,
    issueDelete,
    issueUpdate,

    issuesInProject,
    issues,

    projectCreate,
    projectUpdate,
    projectDelete,
    projectsByOwner,
    projectsAll,
    projectsWithOwners,
    projectWithOwner,
};
