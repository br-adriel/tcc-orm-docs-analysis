import { parse } from '@babel/parser';
import { createObjectCsvWriter } from 'csv-writer';
import fs from 'fs';
import { globby } from 'globby';

/**
 * Lê o conteúdo de um arquivo.
 *
 * @param {string} filePath Caminho do arquivo a ser lido.
 * @returns {string} Conteúdo do arquivo como uma string.
 */
function readFile(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

// Lista de métodos nativos a serem ignorados
const nativeMethods = [
  // Métodos de Array
  'from',
  'fromAsync',
  'isArray',
  'of',
  'at',
  'of',
  'concat',
  'copyWithin',
  'entries',
  'every',
  'fill',
  'filter',
  'find',
  'findIndex',
  'findLast',
  'findLastIndex',
  'flat',
  'flatMap',
  'forEach',
  'includes',
  'indexOf',
  'join',
  'keys',
  'lastIndexOf',
  'map',
  'pop',
  'push',
  'reduce',
  'reduceRight',
  'reverse',
  'shift',
  'slice',
  'some',
  'sort',
  'splice',
  'toReversed',
  'toSorted',
  'toSpliced',
  'unshift',
  'with',
  'from',
  'fromAsync',
  'isArray',

  // Métodos de ArrayBuffer
  'isView',
  'resize',
  'slice',
  'transfer',
  'transferToFixedLength',

  // Métodos de AsyncGenerator
  'next',
  'return',
  'throw',

  // Métodos de Atomics
  'add',
  'and',
  'compareExchange',
  'exchange',
  'isLockFree',
  'load',
  'notify',
  'or',
  'store',
  'sub',
  'wait',
  'waitAsync',
  'xor',

  // Métodos de BigInt
  'asIntN',
  'asUintN',

  // Métodos de DataView
  'getBigInt64',
  'getBigUint64',
  'getFloat16',
  'getFloat32',
  'getFloat64',
  'getInt16',
  'getInt32',
  'getInt8',
  'getUint16',
  'getUint32',
  'getUint8',
  'setBigInt64',
  'setBigUint64',
  'setFloat16',
  'setFloat32',
  'setFloat64',
  'setInt16',
  'setInt32',
  'setInt8',
  'setUint16',
  'setUint32',
  'setUint8',

  // Métodos de Date
  'now',
  'parse',
  'UTC',
  'getDate',
  'getDay',
  'getFullYear',
  'getHours',
  'getMilliseconds',
  'getMinutes',
  'getMonth',
  'getSeconds',
  'getTime',
  'getTimezoneOffset',
  'getUTCDate',
  'getUTCDay',
  'getUTCFullYear',
  'getUTCHours',
  'getUTCMilliseconds',
  'getUTCMinutes',
  'getUTCMonth',
  'getUTCSeconds',
  'getYear',
  'setDate',
  'setFullYear',
  'setHours',
  'setMilliseconds',
  'setMinutes',
  'setMonth',
  'setSeconds',
  'setTime',
  'setUTCDate',
  'setUTCFullYear',
  'setUTCHours',
  'setUTCMilliseconds',
  'setUTCMinutes',
  'setUTCMonth',
  'setUTCSeconds',
  'setYear',
  'toDateString',
  'toISOString',
  'toJSON',
  'toLocaleDateString',
  'toLocaleString',
  'toLocaleTimeString',
  'toTimeString',
  'toUTCString',

  // MISC
  'decodeURI',
  'decodeURIComponent',
  'encodeURI',
  'encodeURLComponent',
  'escape',
  'eval',
  'parseFloat',
  'parseInt',
  'unescape',

  // Métodos de FinalizationRegistry
  'register',
  'unregister',

  // Métodos de Function
  'apply',
  'bind',
  'call',
  'toString',

  // Métodos de Generator
  'next',
  'return',
  'throw',
  'isFinite',
  'isNaN',

  // Métodos de Intl
  'getCanonicalLocales',
  'supportedValuesOf',

  // Métodos de Iterator
  'from',
  'drop',
  'every',
  'filter',
  'find',
  'flatMap',
  'forEach',
  'map',
  'reduce',
  'some',
  'take',
  'toArray',

  // Métodos de JSON
  'isRawJSON',
  'parse',
  'rawJSON',
  'stringify',

  // Métodos de Map
  'groupBy',
  'clear',
  'delete',
  'entries',
  'forEach',
  'get',
  'has',
  'keys',
  'set',
  'values',

  // Métodos de Math
  'abs',
  'acos',
  'acosh',
  'asin',
  'asinh',
  'atan',
  'atan2',
  'atanh',
  'cbrt',
  'ceil',
  'clz32',
  'cos',
  'cosh',
  'exp',
  'expm1',
  'f16round',
  'floor',
  'fround',
  'hypot',
  'imul',
  'log',
  'log10',
  'log1p',
  'log2',
  'max',
  'min',
  'pow',
  'random',
  'round',
  'sign',
  'sin',
  'sinh',
  'sqrt',
  'tan',
  'tanh',
  'trunc',

  // Métodos de Number
  'isFinite',
  'isInteger',
  'isNaN',
  'isSafeInteger',
  'parseFloat',
  'parseInt',
  'toExponential',
  'toFixed',
  'toLocaleString',
  'toPrecision',
  'toString',
  'valueOf',

  // Métodos de Object
  'assign',
  'create',
  'defineProperties',
  'defineProperty',
  'entries',
  'freeze',
  'fromEntries',
  'getOwnPropertyDescriptor',
  'getOwnPropertyDescriptors',
  'getOwnPropertyNames',
  'getOwnPropertySymbols',
  'groupBy',
  'getPrototypeOf',
  'is',
  'hasOwn',
  'isFrozen',
  'isExtensible',
  'keys',
  'isSealed',
  'seal',
  'preventExtensions',
  'values',
  'setPrototypeOf',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toLocaleString',
  'toString',
  'valueOf',

  // Métodos de Promise
  'all',
  'allSettled',
  'any',
  'race',
  'reject',
  'resolve',
  'try',
  'withResolvers',
  'catch',
  'finally',
  'then',

  // Métodos de Proxy
  'revocable',

  // Métodos de Reflect
  'apply',
  'construct',
  'defineProperty',
  'deleteProperty',
  'get',
  'getOwnPropertyDescriptor',
  'getPrototypeOf',
  'has',
  'isExtensible',
  'ownKeys',
  'preventExtensions',
  'set',
  'setPrototypeOf',

  // Métodos de RegExp
  'escape',
  'compile',
  'exec',
  'test',
  'toString',

  // Métodos de Set
  'add',
  'clear',
  'delete',
  'difference',
  'entries',
  'forEach',
  'has',
  'intersection',
  'isDisjointFrom',
  'isSubsetOf',
  'isSupersetOf',
  'keys',
  'symmetricDifference',
  'union',
  'values',

  // Métodos de SharedArrayBuffer
  'grow',
  'slice',

  // Métodos de String
  'fromCharCode',
  'fromCodePoint',
  'raw',
  'anchor',
  'at',
  'big',
  'blink',
  'bold',
  'charAt',
  'charCodeAt',
  'codePointAt',
  'concat',
  'endsWith',
  'fixed',
  'fontcolor',
  'fontsize',
  'includes',
  'indexOf',
  'isWellFormed',
  'italics',
  'lastIndexOf',
  'link',
  'localeCompare',
  'match',
  'matchAll',
  'normalize',
  'padEnd',
  'padStart',
  'repeat',
  'replace',
  'replaceAll',
  'search',
  'slice',
  'small',
  'split',
  'startsWith',
  'strike',
  'sub',
  'substr',
  'substring',
  'sup',
  'toLocaleLowerCase',
  'toLocaleUpperCase',
  'toLowerCase',
  'toString',
  'toUpperCase',
  'toWellFormed',
  'trim',
  'trimEnd',
  'trimStart',
  'valueOf',

  // Métodos de Symbol
  'for',
  'keyFor',
  'toString',
  'valueOf',

  // Métodos de TypedArray
  'from',
  'of',
  'at',
  'copyWithin',
  'entries',
  'every',
  'fill',
  'filter',
  'find',
  'findIndex',
  'findLast',
  'findLastIndex',
  'forEach',
  'includes',
  'indexOf',
  'join',
  'keys',
  'lastIndexOf',
  'map',
  'reduce',
  'reduceRight',
  'reverse',
  'set',
  'slice',
  'some',
  'sort',
  'subarray',
  'toLocaleString',
  'toReversed',
  'toSorted',
  'toString',
  'values',
  'with',

  // Métodos de WeakMap
  'delete',
  'get',
  'has',
  'set',

  // Métodos de WeakRef
  'deref',

  // Métodos de WeakSet
  'add',
  'delete',
  'has',
];

/**
 * Verifica se um método é nativo.
 *
 * @param {string} methodName Nome do método a ser verificado.
 * @returns {boolean} `true` se o método for nativo, caso contrário `false`.
 */
function isNativeMethod(methodName) {
  return nativeMethods.includes(methodName);
}

/**
 * Extrai assinaturas de métodos e funções públicas a partir de uma árvore sintática abstrata (AST).
 *
 * @param {Object} ast A árvore sintática abstrata (AST) do código.
 * @returns {Array} Lista de objetos contendo informações sobre métodos e funções (nome, tipo e assinatura).
 */
function extractPublicMethodsAndFunctions(ast) {
  const signatures = [];

  // Função recursiva para percorrer a AST
  function visitNode(node) {
    if (!node) return;

    // Funções declaradas
    if (
      node.type === 'FunctionDeclaration' &&
      node.id &&
      node.id.name &&
      !isNativeMethod(node.id.name)
    ) {
      signatures.push({
        name: node.id.name,
        type: 'function',
        signature: `function ${node.id.name}(${node.params
          .map((param) => param.name)
          .join(', ')})`,
      });
    }

    // Métodos de instância
    if (
      node.type === 'MethodDefinition' &&
      node.key &&
      node.key.name &&
      !isNativeMethod(node.key.name)
    ) {
      signatures.push({
        name: node.key.name,
        type: 'method',
        signature: `${node.key.name}(${node.value.params
          .map((param) => param.name)
          .join(', ')})`,
      });
    }

    // Métodos do prototype ou herdados
    if (
      node.type === 'CallExpression' &&
      node.callee.type === 'MemberExpression' &&
      !isNativeMethod(node.callee.property.name)
    ) {
      const methodName = node.callee.property.name;
      if (methodName) {
        signatures.push({
          name: methodName,
          type: 'prototype method',
          signature: `${methodName}()`,
        });
      }
    }

    // Funções anônimas
    if (
      node.type === 'FunctionExpression' &&
      node.id &&
      node.id.name &&
      !isNativeMethod(node.id.name)
    ) {
      signatures.push({
        name: node.id.name,
        type: 'function expression',
        signature: `function ${node.id.name}(${node.params
          .map((param) => param.name)
          .join(', ')})`,
      });
    }

    // Funções arrow
    if (
      node.type === 'ArrowFunctionExpression' &&
      node.id &&
      node.id.name &&
      !isNativeMethod(node.id.name)
    ) {
      signatures.push({
        name: node.id.name,
        type: 'arrow function',
        signature: `(${node.params.map((param) => param.name).join(', ')}) =>`,
      });
    }

    // Funções assíncronas
    if (
      node.type === 'AsyncFunctionDeclaration' &&
      node.id &&
      node.id.name &&
      !isNativeMethod(node.id.name)
    ) {
      signatures.push({
        name: node.id.name,
        type: 'async function',
        signature: `async function ${node.id.name}(${node.params
          .map((param) => param.name)
          .join(', ')})`,
      });
    }

    if (
      node.type === 'AsyncFunctionExpression' &&
      node.id &&
      node.id.name &&
      !isNativeMethod(node.id.name)
    ) {
      signatures.push({
        name: node.id.name,
        type: 'async function expression',
        signature: `async function ${node.id.name}(${node.params
          .map((param) => param.name)
          .join(', ')})`,
      });
    }

    if (
      node.type === 'AsyncArrowFunctionExpression' &&
      node.id &&
      node.id.name &&
      !isNativeMethod(node.id.name)
    ) {
      signatures.push({
        name: node.id.name,
        type: 'async arrow function',
        signature: `async (${node.params
          .map((param) => param.name)
          .join(', ')}) =>`,
      });
    }

    // Métodos de classe
    if (
      node.type === 'MethodDefinition' &&
      node.key &&
      node.key.name &&
      !isNativeMethod(node.key.name)
    ) {
      signatures.push({
        name: node.key.name,
        type: 'method',
        signature: `${node.key.name}(${node.value.params
          .map((param) => param.name)
          .join(', ')})`,
      });
    }

    // Métodos estáticos
    if (
      node.type === 'StaticMethodDefinition' &&
      node.key &&
      node.key.name &&
      !isNativeMethod(node.key.name)
    ) {
      signatures.push({
        name: node.key.name,
        type: 'static method',
        signature: `${node.key.name}(${node.value.params
          .map((param) => param.name)
          .join(', ')})`,
      });
    }

    // Métodos geradores
    if (node.type === 'FunctionDeclaration' && node.generator) {
      signatures.push({
        name: node.id.name,
        type: 'generator function',
        signature: `function* ${node.id.name}(${node.params
          .map((param) => param.name)
          .join(', ')})`,
      });
    }

    if (node.type === 'MethodDefinition' && node.generator) {
      signatures.push({
        name: node.key.name,
        type: 'generator method',
        signature: `${node.key.name}*(${node.value.params
          .map((param) => param.name)
          .join(', ')})`,
      });
    }

    // Percorrendo todos os filhos do nó
    for (let key in node) {
      if (node[key] && typeof node[key] === 'object') {
        visitNode(node[key]);
      }
    }
  }

  // Começa a visitação pela raiz da AST
  visitNode(ast);

  return signatures;
}

/**
 * Escreve as assinaturas extraídas em um arquivo CSV.
 *
 * @param {string} fileName Nome do arquivo CSV a ser gerado.
 * @param {Array} signatures Lista das assinaturas a serem escritas no CSV.
 */
function writeCSV(fileName, signatures) {
  const csv = createObjectCsvWriter({
    path: fileName,
    header: [
      { id: 'name', title: 'Name' },
      { id: 'type', title: 'Type' },
      { id: 'signature', title: 'Signature' },
    ],
  });

  // Remove assinaturas duplicadas antes de gravar no CSV
  const uniqueSignatures = Array.from(
    new Set(signatures.map(JSON.stringify))
  ).map(JSON.parse);

  csv.writeRecords(uniqueSignatures);
}

/**
 * Analisa todos os arquivos JS e TS de um diretório e gera um arquivo CSV com as assinaturas extraídas.
 *
 * @param {string} inputDir Diretório onde os arquivos de código fonte estão localizados.
 * @param {string} outputFile Nome do arquivo de saída (CSV).
 * @returns {Promise} Retorna uma promessa que resolve quando a análise for concluída.
 */
async function analyzeAllFiles(inputDir, outputFile) {
  const files = await globby([`${inputDir}/**/*.{js,ts,tsx}`]);
  let allSignatures = [];

  for (const file of files) {
    // console.log(`Analisando: ${file}`);
    const code = readFile(file);

    // Determina qual parser usar de acordo com a linguagem
    const isTypeScript = file.endsWith('.ts');
    const ast = parse(code, {
      sourceType: 'unambiguous',
      plugins: isTypeScript ? ['typescript'] : [],
      errorRecovery: true,
    });

    const signatures = extractPublicMethodsAndFunctions(ast);
    allSignatures = allSignatures.concat(signatures);
  }

  // Gera o arquivo CSV
  writeCSV(outputFile, allSignatures);
}

/**
 * Função principal do script que inicia a análise de arquivos e gera o CSV.
 */
function main() {
  const [
    _,
    __,
    inputDir = './analyze',
    outputFile = './method-signatures.csv',
  ] = process.argv;

  analyzeAllFiles(inputDir, outputFile).catch((err) =>
    console.error('Erro ao analisar arquivos:', err)
  );
}

main();
