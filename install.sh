#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'


# Function to print the status of a command
# Arguments:
#   $1 - The message to print
#   $2 - The exit status of the command (0 for success, non-zero for failure)
print_status() {
    if [ $2 -eq 0 ]; then
        echo -e "${GREEN}✓ $1${NC}"
    else
        echo -e "${RED}✗ $1${NC}"
    fi
}

# Function to check if a command exists
# Arguments:
#   $1 - The command to check
command_exists() {
    command -v "$1" >/dev/null 2>&1
}


check_python_version() {
    if command_exists python3; then
        local version=$(python3 --version 2>&1 | cut -d' ' -f2)
        echo -e "${GREEN}Python ${version} is already installed${NC}"
        return 0
    fi
    return 1
}

check_node_version() {
    if command_exists node; then
        local version=$(node --version 2>&1 | cut -d'v' -f2)
        echo -e "${GREEN}Node.js ${version} is already installed${NC}"
        return 0
    fi
    return 1
}

# Function to check the installed version of Rust
check_rust_version() {
    if command_exists rustc; then
        local version=$(rustc --version 2>&1 | cut -d' ' -f2)
        echo -e "${GREEN}Rust ${version} is already installed${NC}"
        return 0
    fi
    return 1
}

# Function to safely update PATH in .bashrc
# Arguments:
#   $1 - The new path to add to PATH
update_path() {
    local new_path="$1"
    local bashrc="$HOME/.bashrc"
    
    # Remove any existing PATH export with the same component
    sed -i "\#export PATH=.*${new_path}.*#d" "$bashrc"
    
    # Add the new PATH export, properly escaped
    echo "export PATH=\"${new_path}:\$PATH\"" >> "$bashrc"
}

# Function to install Python and its dependencies
install_python() {
    echo -e "\n${YELLOW}Setting up Python environment...${NC}"
    
    # Install pyenv if not present
    if ! check_pyenv; then
        install_if_missing "pyenv" \
            "curl https://pyenv.run | bash && \
             echo 'export PYENV_ROOT=\"\$HOME/.pyenv\"' >> ~/.bashrc && \
             echo 'command -v pyenv >/dev/null || export PATH=\"\$PYENV_ROOT/bin:\$PATH\"' >> ~/.bashrc && \
             echo 'eval \"\$(pyenv init -)\"' >> ~/.bashrc" \
            "pyenv"
        
        if [ $? -ne 0 ]; then
            echo -e "${RED}Failed to install pyenv${NC}"
            return 1
        fi
        source ~/.bashrc
    fi
    
    if ! command_exists python3; then
        echo "Installing Python..."
        pyenv install 3.12.0
        pyenv global 3.12.0
    else
        echo -e "${GREEN}Python $(python3 --version) is already installed${NC}"
    fi
    
    if ! command_exists pip; then
        echo "Installing pip..."
        curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
        python3 get-pip.py
        rm get-pip.py
    else
        echo -e "${GREEN}pip $(pip --version) is already installed${NC}"
    fi
    
    print_status "Python setup complete" $?
}

check_npm() {
    check_version_manager "npm" "npm --version" "npm"
}

install_node() {
    echo -e "\n${YELLOW}Setting up Node.js environment...${NC}"
    
    # Install nvm if not present
    if ! check_nvm; then
        echo "Installing nvm..."
        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
        export NVM_DIR="$HOME/.nvm"
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
        
        if [ $? -ne 0 ]; then
            echo -e "${RED}Failed to install nvm${NC}"
            return 1
        fi
        source ~/.bashrc
    fi
    
    # Install Node.js using nvm
    if ! command_exists node; then
        echo "Installing Node.js..."
        nvm install
        nvm use
    else
        echo -e "${GREEN}Node.js $(node --version) is already installed${NC}"
    fi
    
    # Install global packages with timeouts
    echo "Installing global packages..."
    if ! command_exists tsc; then
        timeout 30 npm install -g typescript || {
            echo -e "${RED}Failed to install TypeScript${NC}"
            return 1
        }
    else
        echo -e "${GREEN}TypeScript is already installed${NC}"
    fi
    
    if ! command_exists ts-node; then
        timeout 30 npm install -g ts-node || {
            echo -e "${RED}Failed to install ts-node${NC}"
            return 1
        }
    else
        echo -e "${GREEN}ts-node is already installed${NC}"
    fi
    
    print_status "Node.js setup complete" $?
}

install_rust() {
    echo -e "\n${YELLOW}Setting up Rust environment...${NC}"
    
    if check_rust_version; then
        echo -e "${YELLOW}Checking for updates...${NC}"
    else
        curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
        source $HOME/.cargo/env
    fi
    
    init_project "Rust" init_rust_project
    print_status "Rust setup complete" $?
}

check_pyenv() {
    check_version_manager "pyenv" "pyenv --version" "pyenv"
}

check_nvm() {
    if [ -d "$HOME/.nvm" ]; then
        local version=$(nvm --version 2>&1)
        echo -e "${GREEN}nvm ${version} is already installed${NC}"
        return 0
    fi
    return 1
}

check_rustup() {
    if command_exists rustup; then
        local version=$(rustup --version 2>&1 | cut -d' ' -f2)
        echo -e "${GREEN}rustup ${version} is already installed${NC}"
        return 0
    fi
    return 1
}

install_version_managers() {
    echo -e "\n${YELLOW}Installing language version managers...${NC}"

      if ! check_pyenv; then
        curl https://pyenv.run | bash
        echo 'export PYENV_ROOT="$HOME/.pyenv"' >> ~/.bashrc
        echo 'command -v pyenv >/dev/null || export PATH="$PYENV_ROOT/bin:$PATH"' >> ~/.bashrc
        echo 'eval "$(pyenv init -)"' >> ~/.bashrc
    fi
    
    if ! check_nvm; then
        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
        export NVM_DIR="$HOME/.nvm"
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    fi

    if ! check_rustup; then
        curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
        source "$HOME/.cargo/env"
    fi
}

install_packages() {
    echo -e "\n${YELLOW}Installing required packages...${NC}"
    
    if command_exists bun; then
        echo "Installing bun packages..."
        bun install
        print_status "Bun packages installation" $?
    else
        echo "Installing npm packages..."
        npm install
        print_status "NPM packages installation" $?
    fi
    
    if command_exists cargo; then
        echo "Installing Cargo packages..."
        if [ -f "Cargo.toml" ]; then
            awk '
            BEGIN { 
                print "[workspace]"
                print "resolver = \"2\""
                print "members = ["
                print "    \"challenges/*/[0-9]/rs\","
                print "    \"challenges/*/[0-9][0-9]/rs\","
                print "    \"template/rs\""
                print "]\n"
            }
            /\[workspace.dependencies\]/ { deps=1; next }
            deps && /^\[/ { deps=0 }
            !deps { print }
            END {
                if (!deps) print "\n[workspace.dependencies]"
                print "anyhow = \"1.0\""
                print "big-o-test = \"0.2.8\""
                print "colored = \"2.1\""
                print "log = \"0.4\""
                print "simple_logger = \"5.0.0\""
            }
            ' > Cargo.toml.tmp && mv Cargo.toml.tmp Cargo.toml
            
            # Run cargo update to fetch the dependencies
            cargo update
            print_status "Cargo packages installation" $?
        else
            echo -e "${RED}Cargo.toml not found in current directory${NC}"
            print_status "Cargo packages installation" 1
        fi
    fi
    
    if command_exists pip; then
        echo "Installing Python packages..."
        pip install -r requirements.txt
        print_status "Python packages installation" $?
    fi
}

install_version_managers
check_python_version
check_node_version
check_rust_version
install_packages

echo -e "\n${GREEN}All installations completed!${NC}"