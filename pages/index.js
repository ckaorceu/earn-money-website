// pages/index.js
import Head from 'next/head';
import fs from 'fs';
import path from 'path';

export async function getStaticProps() {
    // 读取HTML文件
    const filePath = path.join(process.cwd(), 'public', 'index.html');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return {
        props: {
            htmlContent: fileContents
        }
    };
}

export default function Home({ htmlContent }) {
    return (
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    );
}