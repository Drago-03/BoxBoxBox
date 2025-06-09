import logging
import sys
from typing import Dict, Any
import json
from datetime import datetime


class JSONFormatter(logging.Formatter):
    """
    Formatter that outputs JSON strings after parsing the log record.
    """
    def format(self, record: logging.LogRecord) -> str:
        logobj: Dict[str, Any] = {}
        logobj["timestamp"] = datetime.utcnow().isoformat()
        logobj["level"] = record.levelname
        logobj["name"] = record.name
        logobj["message"] = record.getMessage()
        
        if hasattr(record, "props"):
            logobj["props"] = record.props  # type: ignore
            
        if record.exc_info:
            logobj["exception"] = self.formatException(record.exc_info)
            
        return json.dumps(logobj)


def setup_logging() -> None:
    """
    Configure logging with a custom JSON formatter for production
    and a more human-readable format for development.
    """
    # Get root logger
    root_logger = logging.getLogger()
    root_logger.setLevel(logging.INFO)
    
    # Remove existing handlers
    for handler in root_logger.handlers[:]:
        root_logger.removeHandler(handler)
    
    # Create console handler
    console_handler = logging.StreamHandler(sys.stdout)
    
    # Check if we're in development mode
    from app.core.config import settings
    
    if settings.DEBUG_MODE:
        # More human-readable format for development
        formatter = logging.Formatter(
            "[%(asctime)s] [%(levelname)s] [%(name)s] %(message)s",
            datefmt="%Y-%m-%d %H:%M:%S"
        )
    else:
        # JSON formatter for production
        formatter = JSONFormatter()
    
    console_handler.setFormatter(formatter)
    root_logger.addHandler(console_handler)
    
    # Set third-party loggers to WARNING level
    logging.getLogger("uvicorn").setLevel(logging.WARNING)
    logging.getLogger("sqlalchemy").setLevel(logging.WARNING)
    
    # Log startup
    root_logger.info("Logging configured")


class LoggerWithProps(logging.Logger):
    """
    Logger that allows attaching properties to log records.
    """
    def _log_with_props(
        self, level: int, msg: str, props: Dict[str, Any], *args, **kwargs
    ) -> None:
        if self.isEnabledFor(level):
            record = self.makeRecord(
                self.name, level, "", 0, msg, args, kwargs.get("exc_info"), None
            )
            record.props = props  # type: ignore
            self.handle(record)
    
    def info_with_props(self, msg: str, props: Dict[str, Any], *args, **kwargs) -> None:
        self._log_with_props(logging.INFO, msg, props, *args, **kwargs)
    
    def warning_with_props(self, msg: str, props: Dict[str, Any], *args, **kwargs) -> None:
        self._log_with_props(logging.WARNING, msg, props, *args, **kwargs)
    
    def error_with_props(self, msg: str, props: Dict[str, Any], *args, **kwargs) -> None:
        self._log_with_props(logging.ERROR, msg, props, *args, **kwargs)
    
    def debug_with_props(self, msg: str, props: Dict[str, Any], *args, **kwargs) -> None:
        self._log_with_props(logging.DEBUG, msg, props, *args, **kwargs)


# Replace Logger class with our custom one
logging.setLoggerClass(LoggerWithProps) 