#!/bin/bash

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 打印带颜色的消息
print_message() {
    echo -e "${GREEN}$1${NC}"
}

print_warning() {
    echo -e "${YELLOW}$1${NC}"
}

print_error() {
    echo -e "${RED}$1${NC}"
}

print_info() {
    echo -e "${BLUE}$1${NC}"
}

# 检查是否在正确的目录
check_directory() {
    if [ ! -f "package.json" ] || [ ! -d "packages/react-tweet" ]; then
        print_error "❌ 错误：请在项目根目录运行此脚本"
        exit 1
    fi
}

# 检查是否有未提交的更改
check_git_status() {
    if [ -d ".git" ]; then
        if [ -n "$(git status --porcelain)" ]; then
            print_warning "⚠️  检测到未提交的更改"
            read -p "是否继续发布？(y/N): " -n 1 -r
            echo
            if [[ ! $REPLY =~ ^[Yy]$ ]]; then
                print_info "发布已取消"
                exit 0
            fi
        fi
    fi
}

# 更新版本号
update_version() {
    print_info "📦 更新版本号..."
    cd packages/react-tweet
    
    # 获取当前版本
    current_version=$(node -p "require('./package.json').version")
    print_info "当前版本: $current_version"
    
    # 更新版本号
    npm version patch
    
    # 获取新版本
    new_version=$(node -p "require('./package.json').version")
    print_info "新版本: $new_version"
    
    cd ../..
}

# 重新构建
rebuild() {
    print_info "🔨 重新构建..."
    
    # 清理
    print_info "清理构建文件..."
    pnpm clean
    
    # 构建
    print_info "构建项目..."
    pnpm build
    
    if [ $? -ne 0 ]; then
        print_error "❌ 构建失败，请检查错误信息"
        exit 1
    fi
    
    print_message "✅ 构建成功"
}

# 发布到 npm
publish() {
    print_info "📤 发布到 npm..."
    cd packages/react-tweet
    
    # 检查是否已登录
    if ! npm whoami > /dev/null 2>&1; then
        print_error "❌ 未登录 npm，请先运行 npm login"
        exit 1
    fi
    
    # 发布
    npm publish
    
    if [ $? -ne 0 ]; then
        print_error "❌ 发布失败，请检查错误信息"
        exit 1
    fi
    
    cd ../..
}

# 验证发布
verify_publish() {
    print_info "🔍 验证发布..."
    
    # 获取最新版本
    latest_version=$(npm view @abel_wong/react-tweet version)
    print_message "✅ 发布成功！最新版本: $latest_version"
    
    # 显示包信息
    print_info "📋 包信息:"
    npm view @abel_wong/react-tweet --json | jq -r '. | {name, version, description, author, repository}'
}

# 主函数
main() {
    print_message "🚀 开始发布 @abel_wong/react-tweet 新版本..."
    echo
    
    # 检查目录
    check_directory
    
    # 检查 Git 状态
    check_git_status
    
    # 更新版本号
    update_version
    
    # 重新构建
    rebuild
    
    # 发布
    publish
    
    # 验证发布
    verify_publish
    
    print_message "🎉 发布流程完成！"
}

# 运行主函数
main "$@" 