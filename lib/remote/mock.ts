import User from "../auth/User";

const mockUser = new User()
mockUser.names = 'Vincent Peter'

const Mock = {
  auth: {
    user: mockUser,
    token: "123456789"
  },
  services: [],
  products: []
};

export default Mock
  