/**
 * 茶海虾王@金融交易所看板平台 - 告警通知渠道配置
 * 支持邮件、短信、Slack、Webhook等多种通知方式
 */

const nodemailer = require('nodemailer');
const axios = require('axios');
const { logger } = require('./logger');

// 告警渠道配置
const alertChannelConfig = {
  // 邮件配置
  email: {
    enabled: process.env.ALERT_EMAIL_ENABLED === 'true',
    smtp: {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    },
    from: process.env.ALERT_EMAIL_FROM || 'alerts@tea-sea-shrimp-king.com',
    to: process.env.ALERT_EMAIL_TO?.split(',') || ['admin@tea-sea-shrimp-king.com'],
    templates: {
      critical: {
        subject: '🚨 严重告警 - 茶海虾王金融交易所',
        priority: 'high'
      },
      warning: {
        subject: '⚠️ 警告 - 茶海虾王金融交易所',
        priority: 'normal'
      },
      info: {
        subject: 'ℹ️ 信息 - 茶海虾王金融交易所',
        priority: 'normal'
      }
    }
  },

  // Slack配置
  slack: {
    enabled: process.env.ALERT_SLACK_ENABLED === 'true',
    webhookUrl: process.env.SLACK_WEBHOOK_URL,
    channel: process.env.SLACK_CHANNEL || '#alerts',
    username: process.env.SLACK_USERNAME || 'TeaSeaShrimpKing-Bot',
    iconEmoji: process.env.SLACK_ICON || ':warning:'
  },

  // 企业微信配置
  wechat: {
    enabled: process.env.ALERT_WECHAT_ENABLED === 'true',
    corpId: process.env.WECHAT_CORP_ID,
    corpSecret: process.env.WECHAT_CORP_SECRET,
    agentId: process.env.WECHAT_AGENT_ID,
    toUser: process.env.WECHAT_TO_USER || '@all'
  },

  // 钉钉配置
  dingtalk: {
    enabled: process.env.ALERT_DINGTALK_ENABLED === 'true',
    webhookUrl: process.env.DINGTALK_WEBHOOK_URL,
    secret: process.env.DINGTALK_SECRET,
    atMobiles: process.env.DINGTALK_AT_MOBILES?.split(',') || []
  },

  // Webhook配置
  webhook: {
    enabled: process.env.ALERT_WEBHOOK_ENABLED === 'true',
    url: process.env.WEBHOOK_URL,
    method: process.env.WEBHOOK_METHOD || 'POST',
    headers: JSON.parse(process.env.WEBHOOK_HEADERS || '{}'),
    timeout: parseInt(process.env.WEBHOOK_TIMEOUT) || 5000
  },

  // 短信配置
  sms: {
    enabled: process.env.ALERT_SMS_ENABLED === 'true',
    provider: process.env.SMS_PROVIDER || 'aliyun', // aliyun, tencent, twilio
    config: {
      // 阿里云短信
      aliyun: {
        accessKeyId: process.env.ALIYUN_ACCESS_KEY_ID,
        accessKeySecret: process.env.ALIYUN_ACCESS_KEY_SECRET,
        signName: process.env.ALIYUN_SMS_SIGN_NAME,
        templateCode: process.env.ALIYUN_SMS_TEMPLATE_CODE
      },
      // 腾讯云短信
      tencent: {
        secretId: process.env.TENCENT_SECRET_ID,
        secretKey: process.env.TENCENT_SECRET_KEY,
        sdkAppId: process.env.TENCENT_SMS_SDK_APP_ID,
        signName: process.env.TENCENT_SMS_SIGN_NAME,
        templateId: process.env.TENCENT_SMS_TEMPLATE_ID
      },
      // Twilio
      twilio: {
        accountSid: process.env.TWILIO_ACCOUNT_SID,
        authToken: process.env.TWILIO_AUTH_TOKEN,
        fromNumber: process.env.TWILIO_FROM_NUMBER
      }
    },
    to: process.env.ALERT_SMS_TO?.split(',') || []
  }
};

// 邮件发送器
const emailSender = {
  transporter: null,

  // 初始化邮件发送器
  init() {
    if (!alertChannelConfig.email.enabled) return;

    this.transporter = nodemailer.createTransporter(alertChannelConfig.email.smtp);
    logger.info('✅ 邮件发送器已初始化');
  },

  // 发送邮件
  async send(alert) {
    if (!alertChannelConfig.email.enabled || !this.transporter) {
      return { success: false, error: '邮件通知未启用' };
    }

    try {
      const template = alertChannelConfig.email.templates[alert.severity] || 
                      alertChannelConfig.email.templates.info;

      const mailOptions = {
        from: alertChannelConfig.email.from,
        to: alertChannelConfig.email.to.join(','),
        subject: template.subject,
        priority: template.priority,
        html: generateEmailTemplate(alert),
        text: generatePlainText(alert)
      };

      const result = await this.transporter.sendMail(mailOptions);
      logger.info(`✅ 邮件发送成功: ${result.messageId}`);
      return { success: true, messageId: result.messageId };

    } catch (error) {
      logger.error('❌ 邮件发送失败:', error);
      return { success: false, error: error.message };
    }
  }
};

// Slack发送器
const slackSender = {
  // 发送Slack消息
  async send(alert) {
    if (!alertChannelConfig.slack.enabled) {
      return { success: false, error: 'Slack通知未启用' };
    }

    try {
      const payload = {
        channel: alertChannelConfig.slack.channel,
        username: alertChannelConfig.slack.username,
        icon_emoji: alertChannelConfig.slack.iconEmoji,
        attachments: [{
          color: getSeverityColor(alert.severity),
          title: alert.title,
          text: alert.message,
          fields: [
            {
              title: '严重程度',
              value: alert.severity.toUpperCase(),
              short: true
            },
            {
              title: '时间',
              value: new Date(alert.timestamp).toLocaleString(),
              short: true
            }
          ],
          footer: '茶海虾王金融交易所',
          ts: Math.floor(Date.now() / 1000)
        }]
      };

      const response = await axios.post(alertChannelConfig.slack.webhookUrl, payload);
      logger.info('✅ Slack消息发送成功');
      return { success: true };

    } catch (error) {
      logger.error('❌ Slack消息发送失败:', error);
      return { success: false, error: error.message };
    }
  }
};

// 企业微信发送器
const wechatSender = {
  accessToken: null,
  tokenExpiry: 0,

  // 获取访问令牌
  async getAccessToken() {
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const url = `https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${alertChannelConfig.wechat.corpId}&corpsecret=${alertChannelConfig.wechat.corpSecret}`;
      const response = await axios.get(url);
      
      if (response.data.access_token) {
        this.accessToken = response.data.access_token;
        this.tokenExpiry = Date.now() + (response.data.expires_in - 300) * 1000;
        return this.accessToken;
      }
      throw new Error('获取访问令牌失败');
    } catch (error) {
      logger.error('❌ 获取企业微信访问令牌失败:', error);
      throw error;
    }
  },

  // 发送企业微信消息
  async send(alert) {
    if (!alertChannelConfig.wechat.enabled) {
      return { success: false, error: '企业微信通知未启用' };
    }

    try {
      const accessToken = await this.getAccessToken();
      const url = `https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token=${accessToken}`;

      const payload = {
        touser: alertChannelConfig.wechat.toUser,
        msgtype: 'text',
        agentid: alertChannelConfig.wechat.agentId,
        text: {
          content: generateWechatMessage(alert)
        }
      };

      const response = await axios.post(url, payload);
      
      if (response.data.errcode === 0) {
        logger.info('✅ 企业微信消息发送成功');
        return { success: true };
      } else {
        throw new Error(response.data.errmsg);
      }

    } catch (error) {
      logger.error('❌ 企业微信消息发送失败:', error);
      return { success: false, error: error.message };
    }
  }
};

// 钉钉发送器
const dingtalkSender = {
  // 生成签名
  generateSign(timestamp) {
    const crypto = require('crypto');
    const stringToSign = `${timestamp}\n${alertChannelConfig.dingtalk.secret}`;
    const sign = crypto.createHmac('sha256', alertChannelConfig.dingtalk.secret)
                      .update(stringToSign)
                      .digest('base64');
    return encodeURIComponent(sign);
  },

  // 发送钉钉消息
  async send(alert) {
    if (!alertChannelConfig.dingtalk.enabled) {
      return { success: false, error: '钉钉通知未启用' };
    }

    try {
      const timestamp = Date.now();
      const sign = this.generateSign(timestamp);
      const url = `${alertChannelConfig.dingtalk.webhookUrl}&timestamp=${timestamp}&sign=${sign}`;

      const payload = {
        msgtype: 'markdown',
        markdown: {
          title: alert.title,
          text: generateDingtalkMessage(alert)
        },
        at: {
          atMobiles: alertChannelConfig.dingtalk.atMobiles,
          isAtAll: alertChannelConfig.dingtalk.atMobiles.length === 0
        }
      };

      const response = await axios.post(url, payload);
      
      if (response.data.errcode === 0) {
        logger.info('✅ 钉钉消息发送成功');
        return { success: true };
      } else {
        throw new Error(response.data.errmsg);
      }

    } catch (error) {
      logger.error('❌ 钉钉消息发送失败:', error);
      return { success: false, error: error.message };
    }
  }
};

// Webhook发送器
const webhookSender = {
  // 发送Webhook请求
  async send(alert) {
    if (!alertChannelConfig.webhook.enabled) {
      return { success: false, error: 'Webhook通知未启用' };
    }

    try {
      const payload = {
        alert: alert,
        timestamp: Date.now(),
        source: 'tea-sea-shrimp-king'
      };

      const response = await axios({
        method: alertChannelConfig.webhook.method,
        url: alertChannelConfig.webhook.url,
        data: payload,
        headers: alertChannelConfig.webhook.headers,
        timeout: alertChannelConfig.webhook.timeout
      });

      logger.info('✅ Webhook请求发送成功');
      return { success: true, status: response.status };

    } catch (error) {
      logger.error('❌ Webhook请求发送失败:', error);
      return { success: false, error: error.message };
    }
  }
};

// 短信发送器
const smsSender = {
  // 发送短信
  async send(alert) {
    if (!alertChannelConfig.sms.enabled) {
      return { success: false, error: '短信通知未启用' };
    }

    const provider = alertChannelConfig.sms.provider;
    const config = alertChannelConfig.sms.config[provider];

    try {
      switch (provider) {
        case 'aliyun':
          return await this.sendAliyunSms(alert, config);
        case 'tencent':
          return await this.sendTencentSms(alert, config);
        case 'twilio':
          return await this.sendTwilioSms(alert, config);
        default:
          throw new Error(`不支持的短信服务商: ${provider}`);
      }
    } catch (error) {
      logger.error('❌ 短信发送失败:', error);
      return { success: false, error: error.message };
    }
  },

  // 阿里云短信
  async sendAliyunSms(alert, config) {
    // 这里需要集成阿里云SDK
    logger.info('发送阿里云短信...');
    return { success: true };
  },

  // 腾讯云短信
  async sendTencentSms(alert, config) {
    // 这里需要集成腾讯云SDK
    logger.info('发送腾讯云短信...');
    return { success: true };
  },

  // Twilio短信
  async sendTwilioSms(alert, config) {
    // 这里需要集成Twilio SDK
    logger.info('发送Twilio短信...');
    return { success: true };
  }
};

// 告警管理器
const alertManager = {
  // 发送告警到所有启用的渠道
  async sendAlert(alert) {
    const results = {};

    // 邮件
    if (alertChannelConfig.email.enabled) {
      results.email = await emailSender.send(alert);
    }

    // Slack
    if (alertChannelConfig.slack.enabled) {
      results.slack = await slackSender.send(alert);
    }

    // 企业微信
    if (alertChannelConfig.wechat.enabled) {
      results.wechat = await wechatSender.send(alert);
    }

    // 钉钉
    if (alertChannelConfig.dingtalk.enabled) {
      results.dingtalk = await dingtalkSender.send(alert);
    }

    // Webhook
    if (alertChannelConfig.webhook.enabled) {
      results.webhook = await webhookSender.send(alert);
    }

    // 短信（仅严重告警）
    if (alertChannelConfig.sms.enabled && alert.severity === 'critical') {
      results.sms = await smsSender.send(alert);
    }

    // 记录发送结果
    logger.info('告警发送结果:', results);

    return results;
  },

  // 测试所有渠道
  async testAllChannels() {
    const testAlert = {
      title: '测试告警',
      message: '这是一条测试告警消息',
      severity: 'info',
      timestamp: Date.now()
    };

    console.log('🧪 测试所有告警渠道...\n');

    const results = await this.sendAlert(testAlert);

    console.log('\n📊 测试结果:');
    for (const [channel, result] of Object.entries(results)) {
      const status = result.success ? '✅' : '❌';
      console.log(`   ${status} ${channel}: ${result.success ? '成功' : result.error}`);
    }

    return results;
  }
};

// 辅助函数
function getSeverityColor(severity) {
  const colors = {
    critical: 'danger',
    warning: 'warning',
    info: 'good'
  };
  return colors[severity] || 'good';
}

function generateEmailTemplate(alert) {
  return `
    <h2 style="color: ${alert.severity === 'critical' ? '#dc3545' : alert.severity === 'warning' ? '#ffc107' : '#17a2b8'}">
      ${alert.title}
    </h2>
    <p><strong>严重程度:</strong> ${alert.severity.toUpperCase()}</p>
    <p><strong>时间:</strong> ${new Date(alert.timestamp).toLocaleString()}</p>
    <p><strong>消息:</strong></p>
    <p>${alert.message}</p>
    ${alert.data ? `<pre>${JSON.stringify(alert.data, null, 2)}</pre>` : ''}
    <hr>
    <p style="color: #666; font-size: 12px;">
      此邮件由茶海虾王金融交易所自动发送<br>
      发送时间: ${new Date().toLocaleString()}
    </p>
  `;
}

function generatePlainText(alert) {
  return `
${alert.title}
严重程度: ${alert.severity.toUpperCase()}
时间: ${new Date(alert.timestamp).toLocaleString()}
消息: ${alert.message}
${alert.data ? `数据: ${JSON.stringify(alert.data, null, 2)}` : ''}

---
此邮件由茶海虾王金融交易所自动发送
发送时间: ${new Date().toLocaleString()}
  `;
}

function generateWechatMessage(alert) {
  return `【${alert.severity.toUpperCase()}】${alert.title}

${alert.message}

时间: ${new Date(alert.timestamp).toLocaleString()}
${alert.data ? `详情: ${JSON.stringify(alert.data)}` : ''}`;
}

function generateDingtalkMessage(alert) {
  return `## 【${alert.severity.toUpperCase()}】${alert.title}

${alert.message}

**时间:** ${new Date(alert.timestamp).toLocaleString()}
${alert.data ? `**详情:** \n\`\`\`json\n${JSON.stringify(alert.data, null, 2)}\n\`\`\`` : ''}`;
}

// 初始化
function init() {
  emailSender.init();
  logger.info('✅ 告警通知渠道已初始化');
}

module.exports = {
  alertChannelConfig,
  alertManager,
  emailSender,
  slackSender,
  wechatSender,
  dingtalkSender,
  webhookSender,
  smsSender,
  init
};
