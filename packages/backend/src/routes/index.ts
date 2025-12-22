import authLogin from "./auth/login";
import authMe from "./auth/me";
import authRegister from "./auth/register";
import issueCreate from "./issue/create";
import issueDelete from "./issue/delete";
import issueUpdate from "./issue/update";
import issuesInProject from "./issues/[projectBlob]";
import issues from "./issues/all";
import projectsAll from "./project/all";
import projectsByCreator from "./project/by-creator";
import projectCreate from "./project/create";
import projectDelete from "./project/delete";
import projectUpdate from "./project/update";
import projectWithCreator from "./project/with-creator";
import projectsWithCreators from "./project/with-creators";

export const routes = {
    issueCreate,
    issueDelete,
    issueUpdate,

    issuesInProject,
    issues,

    projectCreate,
    projectUpdate,
    projectDelete,
    projectsByCreator,
    projectsAll,
    projectsWithCreators,
    projectWithCreator,

    authRegister,
    authLogin,
    authMe,
};
