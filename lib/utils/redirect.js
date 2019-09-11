import Router from 'next/router'
/**
 * redirect within the app
 * if res is defined, redirent on the server side
 * 
 * @param {*} destination 
 * @param {*} args 
 * @param {*} param2 
 */
export default function redirectTo(destination, args = undefined, { res, status } = {}) {

  if (res) {
    res.writeHead(status || 302, { Location: destination })
    res.end()
  } else {
    // if (args !== undefined) Router.push(destination, args)
    //   else Router.push(destination)
    if (destination[0] === '/' && destination[1] !== '/') {
      if (args !== undefined) Router.push(destination, args)
      else Router.push(destination)
    } else if (window !== undefined) {
      window.location = destination
    }
  }
}