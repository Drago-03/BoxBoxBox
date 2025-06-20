from setuptools import setup, find_packages

setup(
    name="boxboxbox",
    version="0.1.0",
    packages=find_packages(),
    install_requires=[
        "fastapi>=0.95.0,<0.96.0",
        "uvicorn>=0.22.0,<0.23.0",
        "sqlalchemy>=2.0.0,<2.1.0",
        "alembic>=1.10.0,<1.11.0",
        "asyncpg>=0.27.0,<0.28.0",
        "python-jose[cryptography]>=3.3.0,<3.4.0",
        "passlib[bcrypt]>=1.7.4,<1.8.0",
        "pydantic>=1.10.0,<2.0.0",
        "python-multipart>=0.0.5,<0.0.6",
        "aiofiles>=0.8.0,<0.9.0",
        "pytest>=7.3.1,<7.4.0",
        "pytest-asyncio>=0.21.0,<0.22.0",
        "httpx>=0.24.0,<0.25.0",
        "pytest-cov>=4.1.0,<4.2.0",
        "aiosqlite>=0.18.0,<0.19.0",
    ],
    extras_require={
        "dev": [
            "black>=23.3.0,<23.4.0",
            "isort>=5.12.0,<5.13.0",
            "mypy>=1.3.0,<1.4.0",
            "flake8>=6.0.0,<6.1.0",
            "pytest>=7.3.1,<7.4.0",
            "pytest-asyncio>=0.21.0,<0.22.0",
            "httpx>=0.24.0,<0.25.0",
            "pytest-cov>=4.1.0,<4.2.0",
        ],
    },
    python_requires=">=3.9,<3.12",
    author="BoxBoxBox Team",
    author_email="team@boxboxbox.io",
    description="F1 Racing Analytics and Visualization Platform",
    keywords="f1, racing, analytics, visualization",
    classifiers=[
        "Development Status :: 3 - Alpha",
        "Intended Audience :: Developers",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
    ],
)