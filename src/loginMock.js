// Mock login data for development
const mockUsers = [
  { email: 'student1@fpt.edu.vn', password: 'password', role: 'student' },
  { email: 'leader1@fpt.edu.vn', password: 'password', role: 'leader' },
  { email: 'member1@fpt.edu.vn', password: 'password', role: 'member' },
  { email: 'lecturer1@fpt.edu.vn', password: 'password', role: 'lecturer' },
  { email: 'admin@fpt.edu.vn', password: 'password', role: 'admin' },
  { email: 'academic@fpt.edu.vn', password: 'password', role: 'academic' },
];

export const mockLogin = async (email, password) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const user = mockUsers.find(u => u.email === email && u.password === password);
  
  if (user) {
    return {
      success: true,
      user: {
        email: user.email,
        role: user.role,
        name: user.email.split('@')[0].replace(/\d/g, '').replace(/^[a-z]/, l => l.toUpperCase())
      }
    };
  } else {
    throw new Error('Invalid email or password');
  }
}; 