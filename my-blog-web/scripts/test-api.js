/**
 * API 集成测试脚本
 * 
 * 这个脚本用于测试前端 API 服务是否正常工作
 * 运行方式: npm run test:api
 */

import { 
  authApiService,
  articleApiService,
  categoryApiService,
  tagApiService,
  commentApiService,
  friendLinkApiService,
  guestbookApiService,
  systemSettingApiService
} from './src/lib/api';

// 测试配置
const TEST_CONFIG = {
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  TEST_USER: {
    username: 'admin',
    password: 'admin123',
    email: 'admin@example.com'
  }
};

// 测试结果
interface TestResult {
  service: string;
  method: string;
  success: boolean;
  error?: string;
  duration: number;
}

const testResults: TestResult[] = [];

// 测试工具函数
async function runTest(
  service: string,
  method: string,
  testFn: () => Promise<any>
): Promise<void> {
  const startTime = Date.now();
  
  try {
    await testFn();
    testResults.push({
      service,
      method,
      success: true,
      duration: Date.now() - startTime
    });
    console.log(`✅ ${service}.${method} - 成功 (${Date.now() - startTime}ms)`);
  } catch (error) {
    testResults.push({
      service,
      method,
      success: false,
      error: error instanceof Error ? error.message : String(error),
      duration: Date.now() - startTime
    });
    console.log(`❌ ${service}.${method} - 失败: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// 测试函数
async function testAuthService() {
  await runTest('AuthService', 'login', async () => {
    const response = await authApiService.login({
      username: TEST_CONFIG.TEST_USER.username,
      password: TEST_CONFIG.TEST_USER.password
    });
    
    if (!response.token) {
      throw new Error('登录响应中缺少 token');
    }
  });

  await runTest('AuthService', 'getCurrentUser', async () => {
    await authApiService.getCurrentUser();
  });
}

async function testArticleService() {
  await runTest('ArticleService', 'getArticles', async () => {
    const response = await articleApiService.getArticles({ page: 1, limit: 5 });
    
    if (!Array.isArray(response.content)) {
      throw new Error('文章列表响应格式错误');
    }
  });

  await runTest('ArticleService', 'getLatestArticles', async () => {
    const articles = await articleApiService.getLatestArticles(5);
    
    if (!Array.isArray(articles)) {
      throw new Error('最新文章响应格式错误');
    }
  });
}

async function testCategoryService() {
  await runTest('CategoryService', 'getAllCategories', async () => {
    const categories = await categoryApiService.getAllCategories();
    
    if (!Array.isArray(categories)) {
      throw new Error('分类列表响应格式错误');
    }
  });
}

async function testTagService() {
  await runTest('TagService', 'getAllTags', async () => {
    const tags = await tagApiService.getAllTags();
    
    if (!Array.isArray(tags)) {
      throw new Error('标签列表响应格式错误');
    }
  });

  await runTest('TagService', 'getPopularTags', async () => {
    const tags = await tagApiService.getPopularTags(10);
    
    if (!Array.isArray(tags)) {
      throw new Error('热门标签响应格式错误');
    }
  });
}

async function testCommentService() {
  await runTest('CommentService', 'getComments', async () => {
    const response = await commentApiService.getComments({ page: 1, limit: 5 });
    
    if (!Array.isArray(response.content)) {
      throw new Error('评论列表响应格式错误');
    }
  });
}

async function testFriendLinkService() {
  await runTest('FriendLinkService', 'getApprovedFriendLinks', async () => {
    const friendLinks = await friendLinkApiService.getApprovedFriendLinks();
    
    if (!Array.isArray(friendLinks)) {
      throw new Error('友链列表响应格式错误');
    }
  });
}

async function testGuestbookService() {
  await runTest('GuestbookService', 'getApprovedMessages', async () => {
    const response = await guestbookApiService.getApprovedMessages({ page: 1, limit: 5 });
    
    if (!Array.isArray(response.content)) {
      throw new Error('留言列表响应格式错误');
    }
  });
}

async function testSystemSettingService() {
  await runTest('SystemSettingService', 'getAllSettings', async () => {
    const settings = await systemSettingApiService.getAllSettings();
    
    if (!Array.isArray(settings)) {
      throw new Error('系统设置列表响应格式错误');
    }
  });

  await runTest('SystemSettingService', 'getSiteInfo', async () => {
    const siteInfo = await systemSettingApiService.getSiteInfo();
    
    if (!siteInfo.siteName) {
      throw new Error('网站信息响应格式错误');
    }
  });
}

// 主测试函数
async function runAllTests() {
  console.log('🚀 开始 API 集成测试...\n');
  console.log(`API 地址: ${TEST_CONFIG.API_URL}\n`);

  // 检查 API 服务是否可用
  try {
    const response = await fetch(`${TEST_CONFIG.API_URL}/api/articles?size=1`);
    if (!response.ok) {
      throw new Error(`API 服务不可用: ${response.status} ${response.statusText}`);
    }
    console.log('✅ API 服务连接正常\n');
  } catch (error) {
    console.log(`❌ API 服务连接失败: ${error instanceof Error ? error.message : String(error)}\n`);
    console.log('请确保后端服务正在运行 (http://localhost:8080)');
    return;
  }

  // 运行所有测试
  await testAuthService();
  await testArticleService();
  await testCategoryService();
  await testTagService();
  await testCommentService();
  await testFriendLinkService();
  await testGuestbookService();
  await testSystemSettingService();

  // 输出测试结果
  console.log('\n📊 测试结果汇总:');
  console.log('='.repeat(50));
  
  const successCount = testResults.filter(r => r.success).length;
  const totalCount = testResults.length;
  
  console.log(`总测试数: ${totalCount}`);
  console.log(`成功: ${successCount}`);
  console.log(`失败: ${totalCount - successCount}`);
  console.log(`成功率: ${((successCount / totalCount) * 100).toFixed(1)}%`);
  
  if (totalCount - successCount > 0) {
    console.log('\n❌ 失败的测试:');
    testResults
      .filter(r => !r.success)
      .forEach(r => {
        console.log(`  - ${r.service}.${r.method}: ${r.error}`);
      });
  }
  
  console.log('\n🎉 API 集成测试完成!');
}

// 如果直接运行此脚本
if (require.main === module) {
  runAllTests().catch(console.error);
}

export { runAllTests, testResults };
