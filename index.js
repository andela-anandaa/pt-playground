require('dotenv').config();

const axios = require('axios');

axios.defaults.headers.common['X-TrackerToken'] = process.env.API_TOKEN;
const baseUrl = process.env.BASE_URL;
const accountId = process.env.MAIN_ACCOUNT_ID;
const trackedProjects = process.env.TRACKED_PROJECTS.split(',');

async function play() {
  try {
    for (let i = 0; i < trackedProjects.length; i += 1) {
      const a = await getCurrentSprintAnalytics(trackedProjects[i]);
      console.log(a);
      process.exit();
    }
  } catch (e) {
    console.error('error occurred');
    // console.error(e);
  }
}

async function getCurrentSprintAnalytics(projectId) {
  // get current iteration number
  const cur = await axios.get(`${baseUrl}projects/${projectId}/iterations?scope=current`);
  console.log(cur.data[0]);
  // TODO: from stories in cur.data[0].stories, find the number of members that participated
  // in the sprint (to calculate story-point/member)
  // Also, breakdown story-points done by each member
  // get the analytics
  const analytics = await axios.get(`${baseUrl}projects/${projectId}/iterations/${cur.data[0].number}/analytics`);
  return analytics.data;
}

play();


/**
 * Endpoints Notes:

- Get all projects in Andela's main account:
  accounts/${accountId}?fields=projects
- Get current iteration analytics:
  - /projects/{project_id}/iterations?scope=current
  - /projects/{project_id}/iterations/{iteration_number}/analytics


Tech vitals collected:
(main)
- average cycle time
- bug count
- velocity
- initiative delivery date shift (not on PT yet!)
(others)
- rejection rate
- accepted stories
- accepted points

 */