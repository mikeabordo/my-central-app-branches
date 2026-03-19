class AuthService {
  async login(idnumber, password) {
    // Mock login functionality since the actual implementation was missing
    if (idnumber && password) {
      return { status: true };
    }
    return { status: false, message: "Invalid credentials" };
  }
}

export default new AuthService();
