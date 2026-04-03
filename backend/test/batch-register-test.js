const axios = require('axios');
const fs = require('fs');
const path = require('path');

// 配置
const API_BASE_URL = 'http://localhost:3000/api';
const BATCH_SIZE = 100;
const LOG_DIR = path.join(__dirname, '..', 'logs');
const BACKUP_DIR = path.join(__dirname, '..', 'backups');

// 确保日志和备份目录存在
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

// 随机生成器
const randomGenerators = {
  // 随机用户名
  username: () => {
    const prefixes = ['user', 'test', 'demo', 'guest', 'member', 'vip', 'gold', 'silver', 'bronze', 'star'];
    const suffixes = ['2024', '2025', '2026', 'pro', 'plus', 'max', 'lite', 'mini', 'super', 'ultra'];
    const randomNum = Math.floor(Math.random() * 10000);
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    return `${prefix}_${suffix}_${randomNum}`;
  },

  // 随机密码
  password: () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars[Math.floor(Math.random() * chars.length)];
    }
    return password;
  },

  // 随机邮箱
  email: (username) => {
    const domains = ['gmail.com', 'qq.com', '163.com', '126.com', 'outlook.com', 'hotmail.com', 'yahoo.com', 'sina.com', 'sohu.com', 'foxmail.com'];
    const domain = domains[Math.floor(Math.random() * domains.length)];
    return `${username}@${domain}`;
  },

  // 随机手机号
  phone: () => {
    const prefixes = ['138', '139', '135', '136', '137', '150', '151', '152', '157', '158', '159', '182', '183', '187', '188', '130', '131', '132', '155', '156', '185', '186', '133', '153', '180', '189'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
    return `${prefix}${suffix}`;
  },

  // 随机姓名
  name: () => {
    const surnames = ['王', '李', '张', '刘', '陈', '杨', '黄', '赵', '周', '吴', '徐', '孙', '马', '朱', '胡', '郭', '何', '林', '罗', '高'];
    const names = ['伟', '芳', '娜', '敏', '静', '丽', '强', '磊', '军', '洋', '勇', '艳', '杰', '涛', '明', '超', '秀', '霞', '平', '刚', '桂英', '华', '建国', '建军', '国华', '国平', '国栋', '国强', '国梁', '国栋'];
    const surname = surnames[Math.floor(Math.random() * surnames.length)];
    const name = names[Math.floor(Math.random() * names.length)];
    return `${surname}${name}`;
  },

  // 随机身份证号
  idCard: () => {
    const provinces = ['11', '12', '13', '14', '15', '21', '22', '23', '31', '32', '33', '34', '35', '36', '37', '41', '42', '43', '44', '45', '46', '50', '51', '52', '53', '54', '61', '62', '63', '64', '65'];
    const province = provinces[Math.floor(Math.random() * provinces.length)];
    const city = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    const district = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    const year = Math.floor(Math.random() * (2005 - 1960) + 1960);
    const month = Math.floor(Math.random() * 12 + 1).toString().padStart(2, '0');
    const day = Math.floor(Math.random() * 28 + 1).toString().padStart(2, '0');
    const sequence = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const id17 = `${province}${city}${district}${year}${month}${day}${sequence}`;
    // 计算校验码
    const weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    const checkCodes = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
    let sum = 0;
    for (let i = 0; i < 17; i++) {
      sum += parseInt(id17[i]) * weights[i];
    }
    const checkCode = checkCodes[sum % 11];
    return `${id17}${checkCode}`;
  },

  // 随机地址
  address: () => {
    const provinces = ['北京市', '上海市', '广东省', '浙江省', '江苏省', '山东省', '河南省', '四川省', '湖北省', '湖南省', '福建省', '安徽省', '河北省', '陕西省', '辽宁省', '重庆市', '天津市', '江西省', '云南省', '贵州省'];
    const cities = ['市辖区', '市辖区', '广州市', '杭州市', '南京市', '济南市', '郑州市', '成都市', '武汉市', '长沙市', '福州市', '合肥市', '石家庄市', '西安市', '沈阳市', '市辖区', '市辖区', '南昌市', '昆明市', '贵阳市'];
    const streets = ['中山路', '解放路', '人民路', '建设路', '和平路', '新华路', '光明路', '胜利路', '前进路', '东风路', '朝阳路', '友谊路', '文化路', '教育路', '科技路', '创新路', '发展路', '繁荣路', '幸福路', '安康路'];
    const index = Math.floor(Math.random() * provinces.length);
    const streetNum = Math.floor(Math.random() * 999) + 1;
    const buildingNum = Math.floor(Math.random() * 50) + 1;
    const roomNum = Math.floor(Math.random() * 500) + 1;
    return `${provinces[index]}${cities[index]}${streets[index % streets.length]}${streetNum}号${buildingNum}栋${roomNum}室`;
  },

  // 随机性别
  gender: () => {
    return Math.random() > 0.5 ? 'male' : 'female';
  },

  // 随机年龄
  age: () => {
    return Math.floor(Math.random() * (60 - 18) + 18);
  },

  // 随机职业
  occupation: () => {
    const occupations = ['软件工程师', '教师', '医生', '护士', '律师', '会计师', '销售经理', '市场专员', '产品经理', '设计师', '运营专员', '人力资源', '行政助理', '财务经理', '投资顾问', '银行职员', '公务员', '自由职业', '学生', '其他'];
    return occupations[Math.floor(Math.random() * occupations.length)];
  },

  // 随机收入范围
  incomeRange: () => {
    const ranges = ['5000以下', '5000-10000', '10000-20000', '20000-50000', '50000以上'];
    return ranges[Math.floor(Math.random() * ranges.length)];
  }
};

// 生成随机用户数据
function generateRandomUser(index) {
  const username = randomGenerators.username();
  const password = randomGenerators.password();
  const email = randomGenerators.email(username);
  const phone = randomGenerators.phone();
  const realName = randomGenerators.name();
  const idCard = randomGenerators.idCard();
  const address = randomGenerators.address();
  const gender = randomGenerators.gender();
  const age = randomGenerators.age();
  const occupation = randomGenerators.occupation();
  const incomeRange = randomGenerators.incomeRange();

  return {
    index: index + 1,
    username,
    password,
    email,
    phone,
    realName,
    idCard,
    address,
    gender,
    age,
    occupation,
    incomeRange,
    registerTime: new Date().toISOString()
  };
}

// 注册用户
async function registerUser(userData) {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, {
      username: userData.username,
      email: userData.email,
      password: userData.password,
      phone: userData.phone,
      realName: userData.realName,
      idCard: userData.idCard,
      address: userData.address,
      gender: userData.gender,
      age: userData.age,
      occupation: userData.occupation,
      incomeRange: userData.incomeRange
    });

    return {
      success: true,
      status: response.status,
      data: response.data,
      userData
    };
  } catch (error) {
    return {
      success: false,
      status: error.response?.status || 0,
      error: error.response?.data?.message || error.message,
      userData
    };
  }
}

// 保存注册结果到文件
function saveResults(results) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  
  // 保存成功注册的账号
  const successfulRegistrations = results.filter(r => r.success);
  const successFile = path.join(BACKUP_DIR, `registered-users-${timestamp}.json`);
  fs.writeFileSync(successFile, JSON.stringify(successfulRegistrations, null, 2));
  
  // 保存失败的注册
  const failedRegistrations = results.filter(r => !r.success);
  const failFile = path.join(LOG_DIR, `failed-registrations-${timestamp}.json`);
  fs.writeFileSync(failFile, JSON.stringify(failedRegistrations, null, 2));
  
  // 保存CSV格式的用户列表（便于查看）
  const csvContent = [
    '序号,用户名,密码,邮箱,手机号,姓名,身份证号,地址,性别,年龄,职业,收入范围,注册时间,状态',
    ...results.map(r => {
      const u = r.userData;
      return `${u.index},${u.username},${u.password},${u.email},${u.phone},${u.realName},${u.idCard},${u.address},${u.gender},${u.age},${u.occupation},${u.incomeRange},${u.registerTime},${r.success ? '成功' : '失败'}`;
    })
  ].join('\n');
  const csvFile = path.join(BACKUP_DIR, `registered-users-${timestamp}.csv`);
  fs.writeFileSync(csvFile, csvContent);
  
  return { successFile, failFile, csvFile };
}

// 主函数
async function main() {
  console.log('='.repeat(80));
  console.log('茶海虾王@金融交易所看板平台 - 批量用户注册测试');
  console.log('='.repeat(80));
  console.log(`\n测试目标: 自动注册 ${BATCH_SIZE} 个随机用户账号`);
  console.log(`API地址: ${API_BASE_URL}`);
  console.log(`开始时间: ${new Date().toLocaleString()}\n`);

  const results = [];
  const startTime = Date.now();

  // 批量注册
  for (let i = 0; i < BATCH_SIZE; i++) {
    const userData = generateRandomUser(i);
    console.log(`[${i + 1}/${BATCH_SIZE}] 正在注册用户: ${userData.username} (${userData.realName})`);
    
    const result = await registerUser(userData);
    results.push(result);
    
    if (result.success) {
      console.log(`  ✅ 注册成功 - 用户ID: ${result.data?.user?.id || 'N/A'}`);
    } else {
      console.log(`  ❌ 注册失败 - 错误: ${result.error}`);
    }
    
    // 添加延迟，避免请求过快
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  const endTime = Date.now();
  const duration = (endTime - startTime) / 1000;

  // 统计结果
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  const successRate = ((successful / BATCH_SIZE) * 100).toFixed(2);

  // 保存结果
  const files = saveResults(results);

  // 输出测试报告
  console.log('\n' + '='.repeat(80));
  console.log('测试报告');
  console.log('='.repeat(80));
  console.log(`\n总注册数: ${BATCH_SIZE}`);
  console.log(`成功注册: ${successful}`);
  console.log(`注册失败: ${failed}`);
  console.log(`成功率: ${successRate}%`);
  console.log(`测试耗时: ${duration.toFixed(2)} 秒`);
  console.log(`平均耗时: ${(duration / BATCH_SIZE).toFixed(3)} 秒/用户`);
  console.log(`\n文件保存位置:`);
  console.log(`  - 成功注册账号: ${files.successFile}`);
  console.log(`  - 失败注册记录: ${files.failFile}`);
  console.log(`  - CSV用户列表: ${files.csvFile}`);
  console.log(`\n结束时间: ${new Date().toLocaleString()}`);
  console.log('='.repeat(80));

  // 返回测试结果
  return {
    total: BATCH_SIZE,
    successful,
    failed,
    successRate,
    duration,
    files
  };
}

// 运行测试
main()
  .then(result => {
    console.log('\n✅ 批量注册测试完成！');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ 批量注册测试失败:', error);
    process.exit(1);
  });
