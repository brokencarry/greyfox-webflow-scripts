@echo off
rem Grey Fox site: the weekly revisit pass (Task Scheduler). Playwright comes from the greyfoxpartners project's node_modules.
set NODE_PATH=C:\Users\shiva\Claude\02-website\greyfoxpartners\node_modules
set PW=C:\Users\shiva\Claude\02-website\greyfoxpartners\node_modules\playwright
cd /d C:\Users\shiva\Claude\02-website\greyfox-webflow-scripts
node tools\holes\revisit-weekly.js >> C:\Users\shiva\Claude\02-website\holes-revisit\weekly.log 2>&1
