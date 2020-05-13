const fetch = require('node-fetch');
const {Core} = require('@adobe/aio-sdk');

async function main(params) {
  const logger = Core.Logger('main', {level: params.LOG_LEVEL});
  
  try {
    const repo = params.repository.split('/');
    const page = params.page;
    
    // todo verify v4 API with GraphQL
    const res = await fetch(`https://api.github.com/repos/${repo[repo.length - 2]}/${repo[repo.length - 1]}/commits?path=${page}&page=1&per_page=1`, {
      headers: {
        'user-agent': 'node.js',
        'Authorization': `token ${params.github_token}`
      }
    });
    
    const commits = await res.json();
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        sha: commits[0].sha,
        author: commits[0].commit.author
      }
    };
  }
  catch (e) {
    logger.error(e);
    
    return {
      statusCode: 500,
      body: {error: e.message}
    }
  }
}

exports.main = main;