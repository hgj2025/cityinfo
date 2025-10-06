import { CozeAPI } from '@coze/api';
import { logger } from '../utils/logger';

// Coze API配置
const COZE_API_TOKEN = process.env.COZE_API_TOKEN || 'pat_JNcSzYcU8vqpY2hy58DUZuniRo8sm350Z4AiMdWIWEC3Ne3M2fMjGMQXsRa36JYd';
const COZE_API_BASE_URL = process.env.COZE_API_BASE_URL || 'https://api.coze.cn';
const WORKFLOW_ID = process.env.COZE_WORKFLOW_ID || '7503369073804328971';

// Coze API客户端
const cozeClient = new CozeAPI({
  token: COZE_API_TOKEN,
  baseURL: COZE_API_BASE_URL,
});

// 数据采集请求接口
export interface CollectionRequest {
  cityName: string;
}

// 采集结果接口
export interface CollectionResult {
  success: boolean;
  data?: any[];
  error?: string;
  totalCount?: number;
  parseError?: string;  // 数据解析错误信息
  rawContent?: any;     // Coze原始返回内容
}





// Workflow参数接口
interface WorkflowParams {
  city: string;
}

// Workflow结果接口
interface WorkflowResult {
  success: boolean;
  data?: any;
  error?: string;
}

/**
 * 运行Coze Workflow并处理长时间运行的情况
 */
async function runWorkflowWithRetry(params: WorkflowParams): Promise<WorkflowResult> {
  const maxRetries = 3;
  const pollInterval = 5000; // 5秒轮询间隔
  const maxWaitTime = 300000; // 最大等待时间5分钟

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      logger.info(`第${attempt}次尝试运行workflow，参数:`, JSON.stringify(params));
      
      const workflowParams = {
        city: params.city
      };
      
      logger.info(`发送给Coze的参数:`, JSON.stringify(workflowParams));
      logger.info(`城市名称编码检查: ${params.city} (长度: ${params.city.length})`);

      // 使用流式API运行workflow
      const stream = await cozeClient.workflows.runs.stream({
        workflow_id: WORKFLOW_ID,
        parameters: workflowParams
      });

      logger.info(`Workflow流式运行已启动`);

      // 处理流式响应
      let finalResult: any = null;
      let hasError = false;
      let errorMessage = '';

      try {
         for await (const event of stream) {
           logger.info(`收到workflow事件:`, event.event);
           
           if (event.event === 'Message') {
             // 处理消息事件
             if (event.data && (event.data as any).content) {
               const messageContent = (event.data as any).content;
               logger.info(`收到workflow消息，内容长度: ${typeof messageContent === 'string' ? messageContent.length : '非字符串'}`);
               logger.info(`消息内容前100字符: ${typeof messageContent === 'string' ? messageContent.substring(0, 100) : JSON.stringify(messageContent).substring(0, 100)}`);
               finalResult = messageContent;
             }
           } else if (event.event === 'Done') {
             // workflow完成
             logger.info(`Workflow执行完成`);
             if (event.data) {
               finalResult = event.data;
             }
             break;
           } else if (event.event === 'Error') {
             // workflow出错
             hasError = true;
             errorMessage = (event.data as any)?.message || 'Workflow执行出错';
             logger.error(`Workflow执行出错:`, errorMessage);
             break;
           } else if (event.event === 'Interrupt') {
             // workflow中断，需要处理
             logger.warn(`Workflow被中断，需要处理中断事件`);
             // 这里可以根据需要处理中断逻辑
           }
         }
       } catch (streamError: any) {
         logger.error(`处理workflow流时出错:`, streamError);
         hasError = true;
         errorMessage = streamError.message || '处理workflow流时出错';
       }

      if (hasError) {
        throw new Error(errorMessage);
      }

      if (finalResult) {
        logger.info(`Workflow执行成功，获取到数据`);
        return {
          success: true,
          data: finalResult
        };
      } else {
        logger.warn(`Workflow完成但没有返回数据`);
        return {
          success: false,
          error: 'Workflow完成但没有返回数据'
        };
      }

    } catch (error: any) {
      logger.error(`第${attempt}次尝试失败:`, error);
      
      if (attempt === maxRetries) {
        return {
          success: false,
          error: error.message || 'Workflow执行失败'
        };
      }

      // 等待后重试
      const retryDelay = attempt * 2000; // 递增延迟
      logger.info(`等待${retryDelay}ms后重试...`);
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }

  return {
    success: false,
    error: '所有重试尝试都失败了'
  };
}

/**
 * 解析数据
 */
function parseData(content: any): { data: any[], parseError?: string, rawContent?: any } {
  try {
    logger.info('开始解析数据，原始内容类型:', typeof content);
    const contentStr = content ? content.toString() : 'null/undefined';
    logger.info('原始内容长度:', contentStr.length);
    logger.info('原始内容前200字符:', contentStr.substring(0, 200));

    // 如果content已经是数组，直接返回
    if (Array.isArray(content)) {
      logger.info('内容已是数组格式，直接返回');
      return { data: content };
    }

    // 如果是字符串，尝试解析JSON
    if (typeof content === 'string') {
      logger.info('内容是字符串，尝试解析JSON');
      
      // 清理字符串，移除可能的转义字符和格式问题
      let cleanContent = content.trim();
      
      // 如果字符串被双重转义，先解码一次
      if (cleanContent.startsWith('"') && cleanContent.endsWith('"')) {
        try {
          cleanContent = JSON.parse(cleanContent);
          logger.info('检测到双重转义，已解码一层');
        } catch (e) {
          logger.info('不是双重转义格式');
        }
      }
      
      // 尝试直接解析整个字符串
      logger.info('尝试直接解析整个字符串');
      try {
        const parsed = JSON.parse(cleanContent);
        logger.info('成功解析字符串，结果类型:', typeof parsed);
        
        // 检查是否是新的Coze工作流格式 (包含city和content字段)
        if (parsed && typeof parsed === 'object' && parsed.city && parsed.content) {
          logger.info('检测到新的Coze工作流格式，城市:', parsed.city);
          
          // 构建统一的数据结构
          const result = {
            city: parsed.city,
            ...parsed.content,
            pictureAdvises: parsed.pictureAdvises || [],
            pictures: parsed.pictures || []
          };
          
          logger.info('成功解析新格式数据，包含字段:', Object.keys(result));
          return { data: [result] };
        }
        
        // 检查是否是旧格式的数组
        if (Array.isArray(parsed)) {
          return { data: parsed };
        } else if (parsed && parsed.data && Array.isArray(parsed.data)) {
          return { data: parsed.data };
        }
        
        // 如果是单个对象，包装成数组
        if (parsed && typeof parsed === 'object') {
          return { data: [parsed] };
        }
        
      } catch (directParseError: any) {
        logger.warn('直接解析字符串失败:', directParseError);
        
        // 尝试匹配JSON数组格式（兼容旧格式）
        const jsonMatch = cleanContent.match(/\[.*\]/s);
        if (jsonMatch) {
          logger.info('找到JSON数组格式，解析中...');
          try {
            const parsed = JSON.parse(jsonMatch[0]);
            logger.info('成功解析JSON数组，数据条数:', parsed.length);
            return { data: parsed };
          } catch (parseError: any) {
            logger.warn('JSON数组解析失败，尝试修复格式:', parseError);
            
            // 尝试修复常见的JSON格式问题
            let fixedJson = jsonMatch[0]
              .replace(/\\/g, '') // 移除转义字符
              .replace(/"\s*,\s*"/g, '","') // 修复引号间距
              .replace(/,\s*]/g, ']') // 移除尾随逗号
              .replace(/,\s*}/g, '}'); // 移除对象尾随逗号
            
            try {
              const parsed = JSON.parse(fixedJson);
              logger.info('修复后成功解析JSON数组，数据条数:', parsed.length);
              return { data: parsed };
            } catch (fixError: any) {
              logger.warn('修复后仍无法解析JSON:', fixError);
              return {
                data: [],
                parseError: `JSON解析失败: ${parseError.message}，修复后仍失败: ${fixError.message}`,
                rawContent: content
              };
            }
          }
        }
        
        return {
          data: [],
          parseError: `字符串解析失败: ${directParseError.message}`,
          rawContent: content
        };
      }
    }

    // 如果是对象且有data属性
    if (content && content.data && Array.isArray(content.data)) {
      logger.info('内容是对象且有data数组属性');
      return { data: content.data };
    }

    // 如果是对象，检查是否是新的Coze工作流格式
    if (content && typeof content === 'object' && content.city && content.content) {
      logger.info('检测到对象格式的新Coze工作流数据，城市:', content.city);
      
      // 构建统一的数据结构
      const result = {
        city: content.city,
        ...content.content,
        pictureAdvises: content.pictureAdvises || [],
        pictures: content.pictures || []
      };
      
      logger.info('成功解析对象格式数据，包含字段:', Object.keys(result));
      return { data: [result] };
    }

    // 如果不是预期格式，返回空数组
    logger.warn('数据格式不符合预期，返回空数组。内容结构:', Object.keys(content || {}));
    return {
      data: [],
      parseError: `数据格式不符合预期，内容类型: ${typeof content}，结构: ${JSON.stringify(Object.keys(content || {})).substring(0, 100)}`,
      rawContent: content
    };
  } catch (error: any) {
    logger.warn('解析数据失败，返回空数组:', error);
    logger.warn('失败时的内容:', JSON.stringify(content).substring(0, 200));
    return {
      data: [],
      parseError: `解析过程中发生异常: ${error.message}`,
      rawContent: content
    };
  }
}





/**
 * 数据采集函数
 */
export async function collectData(request: CollectionRequest): Promise<CollectionResult> {
  const { cityName } = request;
  
  try {
    logger.info(`开始采集城市 ${cityName} 的数据`);
    
    // 调用Coze API获取城市相关数据
    const result = await runWorkflowWithRetry({ city: cityName });
    
    if (!result.success) {
      logger.error(`Coze API调用失败: ${result.error}`);
      return {
        success: false,
        error: result.error,
        data: [],
        parseError: `API调用失败: ${result.error}`,
        rawContent: null
      };
    }

    const parseResult = parseData(result.data);

    logger.info(`成功采集${cityName}的${parseResult.data.length}条数据`);
    
    return {
      success: true,
      data: parseResult.data,
      parseError: parseResult.parseError,
      rawContent: parseResult.rawContent
    };
  } catch (error: any) {
    logger.error(`采集${cityName}数据失败:`, error);
    return {
      success: false,
      error: error.message,
      data: [],
      parseError: `采集过程中发生异常: ${error.message}`,
      rawContent: null
    };
  }
}