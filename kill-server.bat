@echo off
echo Поиск процессов, использующих порт 5003...
for /f "tokens=5" %%a in ('netstat -ano ^| find ":5003" ^| find "LISTENING"') do (
    echo Обнаружен процесс с PID: %%a
    echo Завершение процесса...
    taskkill /F /PID %%a
    echo Процесс завершен.
)
echo Порт 5003 освобожден.
pause