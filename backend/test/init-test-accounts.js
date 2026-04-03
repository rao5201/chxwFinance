const bcrypt = require('bcryptjs');

// 模拟数据库操作
class MockDatabase {
  constructor() {
    this.users = new Map();
    this.nextId = 1;
  }

  async createUser(userData) {
    const id = this.nextId++;
    const user = {
      id,
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async findUserByUsername(username) {
    for (const user of this.users.values()) {
      if (user.username === username) {
        return user;
      }
    }
    return null;
  }

  async findUserByEmail(email) {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }

  async getAllUsers() {
    return Array.from(this.users.values());
  }
}

// 创建数据库实例
const db = new MockDatabase();

// 测试账号配置
const testAccounts = [
  {
    username: 'admin',
    email: 'admin@example.com',
    password: 'Admin123!',
    role: 'admin',
    balance: 1000000,
    status: 'active'
  },
  {
    username: 'client',
    email: 'client@example.com',
    password: 'Client123!',
    role: 'user',
    balance: 100000,
    status: 'active'
  },
  {
    username: 'finance',
    email: 'finance@example.com',
    password: 'Finance123!',
    role: 'finance',
    balance: 0,
    status: 'active'
  }
];

// 初始化测试账号
async function initTestAccounts() {
  console.log('开始初始化测试账号...');
  
  for (const account of testAccounts) {
    // 检查账号是否已存在
    const existingUserByUsername = await db.findUserByUsername(account.username);
    const existingUserByEmail = await db.findUserByEmail(account.email);
    
    if (existingUserByUsername) {
      console.log(`账号 ${account.username} 已存在，跳过创建`);
      continue;
    }
    
    if (existingUserByEmail) {
      console.log(`邮箱 ${account.email} 已被使用，跳过创建`);
      continue;
    }
    
    // 加密密码
    const hashedPassword = await bcrypt.hash(account.password, 10);
    
    // 创建账号
    const userData = {
      ...account,
      password: hashedPassword
    };
    
    const createdUser = await db.createUser(userData);
    console.log(`成功创建账号: ${createdUser.username} (${createdUser.role})`);
  }
  
  // 显示所有账号
  const allUsers = await db.getAllUsers();
  console.log('\n所有测试账号:');
  allUsers.forEach(user => {
    console.log(`- ${user.username} (${user.role}): ${user.email}`);
  });
  
  console.log('\n测试账号初始化完成！');
  console.log('\n测试账号信息:');
  console.log('1. 管理员账号:');
  console.log('   用户名: admin');
  console.log('   密码: Admin123!');
  console.log('   邮箱: admin@example.com');
  console.log('   角色: admin');
  console.log('');
  console.log('2. 客户账号:');
  console.log('   用户名: client');
  console.log('   密码: Client123!');
  console.log('   邮箱: client@example.com');
  console.log('   角色: user');
  console.log('');
  console.log('3. 财务审计账号:');
  console.log('   用户名: finance');
  console.log('   密码: Finance123!');
  console.log('   邮箱: finance@example.com');
  console.log('   角色: finance');
}

// 运行初始化
initTestAccounts().catch(error => {
  console.error('初始化测试账号失败:', error);
});
