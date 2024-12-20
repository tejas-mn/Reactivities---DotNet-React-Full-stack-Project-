# Pull base image
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-env

# Set Working Directory
WORKDIR /app

# Copy current directory files to /app
COPY . /app/

# Copy .csproj and restore
# COPY "DotNetReact.sln" "DotNetReact.sln"
# COPY "API/API.csproj" "API/API.csproj"
# COPY "Domain/Domain.csproj" "Domain/Domain.csproj"
# COPY "Application/Application.csproj" "Application/Application.csproj"
# COPY "Persistence/Persistence.csproj" "Persistence/Persistence.csproj"
# COPY "Infrastructure/Infrastructure.csproj" "Infrastructure/Infrastructure.csproj"

# Set HOME explicitly to ensure consistency
ENV HOME=/root

# Install .NET tools and debug the installation path
RUN dotnet tool install --global dotnet-ef --version 8.* && \
    echo "Tools installed in: $HOME/.dotnet/tools" && \
    ls -l $HOME/.dotnet/tools

# Add the tools directory to PATH globally
ENV PATH="$PATH:/root/.dotnet/tools"

# Run DB update
RUN dotnet ef database update -s API/API.csproj  -p Persistence/Persistence.csproj 

# Do Dotnet Restore 
RUN dotnet restore "DotNetReact.sln"

# # Copy everything else  build
# COPY . .
# WORKDIR /app
# RUN dotnet publish -c Release -o out

# # Build a runtime image
# FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
# COPY --from=build-env /app/out .
#ENTRYPOINT [ "dotnet" , "API.dll" ]
#ENTRYPOINT [ "dotnet" , "run" ]
