rm -rf build

echo "Compiling Typescript..."
./node_modules/.bin/tsc
echo "Compiled Typescript"

rsync -a --exclude="*.ts" src/ build/

cp collection.json build
cp migrations.json build
cp builders.json build