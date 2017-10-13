# fbapi

Facebook Graph API client for NodeJS

[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]
[![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)

# Install

    npm install fbapi --save

# Usage

```typescript
    import createClient from "fbapi";
    const fbapi = createClient({accessToken: "..."});
    (async ()=>{
        const group = await fbapi.group("123").get();
        const posts = [];
        for await (const post of fbapi.group("123").feed().read({fields:["message"]}, "1568" )){
            posts.push(post);
        }
        console.log(posts);
    })()
    
```

# API



# Test

    npm install
    npm test

[npm-image]: https://badge.fury.io/js/fbapi.svg
[npm-url]: https://npmjs.org/package/fbapi
[travis-image]: https://travis-ci.org/arvitaly/fbapi.svg?branch=master
[travis-url]: https://travis-ci.org/arvitaly/fbapi
[daviddm-image]: https://david-dm.org/arvitaly/fbapi.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/arvitaly/fbapi
[coveralls-image]: https://coveralls.io/repos/arvitaly/fbapi/badge.svg
[coveralls-url]: https://coveralls.io/r/arvitaly/fbapi