// pages/api/subscribe.js
// Vercel API Route for sending subscription emails

import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    // 只允许POST请求
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    const { name, email, phone, wechat, want } = req.body;

    if (!name || !email) {
        return res.status(200).json({ success: false, message: '姓名和邮箱不能为空' });
    }

    // 创建邮件传输器
    const transporter = nodemailer.createTransport({
        host: 'smtp.qq.com',
        port: 465,
        secure: true,
        auth: {
            user: '2726094413@qq.com',
            pass: 'bttqzucdeulrddaf'
        }
    });

    // 管理员通知邮件
    const adminHtml = `
    <html>
    <body style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;'>
        <div style='background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;'>
            <h2>🎉 新用户订阅通知</h2>
            <p>有人订阅了您的副业赚钱网！</p>
        </div>
        <div style='background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;'>
            <table style='width: 100%; border-collapse: collapse;'>
                <tr><td style='padding: 15px; border-bottom: 1px solid #eee; font-weight: bold;'>姓名</td><td style='padding: 15px; border-bottom: 1px solid #eee;'>${name}</td></tr>
                <tr><td style='padding: 15px; border-bottom: 1px solid #eee; font-weight: bold;'>邮箱</td><td style='padding: 15px; border-bottom: 1px solid #eee;'>${email}</td></tr>
                <tr><td style='padding: 15px; border-bottom: 1px solid #eee; font-weight: bold;'>手机</td><td style='padding: 15px; border-bottom: 1px solid #eee;'>${phone || '未填写'}</td></tr>
                <tr><td style='padding: 15px; border-bottom: 1px solid #eee; font-weight: bold;'>QQ号</td><td style='padding: 15px; border-bottom: 1px solid #eee;'>${wechat || '未填写'}</td></tr>
                <tr><td style='padding: 15px; font-weight: bold;'>感兴趣项目</td><td style='padding: 15px;'>${want || '未填写'}</td></tr>
            </table>
            <p style='color: #666; font-size: 14px; margin-top: 20px;'>订阅时间：${new Date().toLocaleString('zh-CN')}</p>
        </div>
        <div style='text-align: center; padding: 20px; color: #999; font-size: 12px;'>
            <p>副业赚钱网 - 让每个人都能轻松赚钱</p>
        </div>
    </body>
    </html>
    `;

    // 用户确认邮件
    const userHtml = `
    <html>
    <body style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;'>
        <div style='background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;'>
            <h2>🎉 恭喜 ${name} 订阅成功！</h2>
            <p>感谢您的订阅，我们会每天推送最新赚钱项目！</p>
        </div>
        <div style='background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;'>
            <h3>📱 客服联系方式</h3>
            <p style='font-size: 20px;'><strong>QQ：2726094413</strong></p>
            <p>如有疑问，欢迎随时咨询！</p>
            <hr style='border: none; border-top: 1px solid #ddd; margin: 20px 0;'>
            <p>祝您早日实现财务自由！💰</p>
        </div>
        <div style='text-align: center; padding: 20px; color: #999; font-size: 12px;'>
            <p>副业赚钱网 - 让每个人都能轻松赚钱</p>
        </div>
    </body>
    </html>
    `;

    try {
        // 发送给管理员
        await transporter.sendMail({
            from: '"副业赚钱网" <2726094413@qq.com>',
            to: '2726094413@qq.com',
            subject: `【副业赚钱网】新用户订阅 - ${name}`,
            html: adminHtml
        });

        // 发送给用户
        await transporter.sendMail({
            from: '"副业赚钱网" <2726094413@qq.com>',
            to: email,
            subject: '🎉 恭喜您订阅成功！- 副业赚钱网',
            html: userHtml
        });

        return res.status(200).json({ success: true, message: '订阅成功！我们会尽快联系您' });
    } catch (error) {
        console.error('发送邮件失败:', error);
        return res.status(200).json({ success: false, message: '发送失败，请稍后重试' });
    }
}