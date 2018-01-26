cd C:/Users/U5/Desktop/ggj
SET /P msg=Resumen de cambios: 
git add -A
git commit -m "%msg%"
git push origin