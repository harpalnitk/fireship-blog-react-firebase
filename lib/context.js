// use react context api for storing
//user auth information
//a context defined in a component tree can
//be used by any child, or nested child anywhere
//in the component tree hierarchy.

import { createContext } from 'react';
export const UserContext = createContext({ user: null, username: null });