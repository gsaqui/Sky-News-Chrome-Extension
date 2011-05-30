
def stories = []
stories << "Obama praises 'extraordinary' Irish"
stories << "Alien steals car from cowboy"
stories << "Volcanic ash cloud threat hits airline shares"
stories << "Canada once again better than USA"
stories << "Americans admit they aren't as cool as Canadian"

def json = new File('testData.json')

def output = new File('output')

json.eachLine(){line, number ->
    Random random = new Random()
    def randomNum = random.nextInt(5)
	def time = new Date()
	def timeStr = time.format('H:mm:ss');

    if(line.contains('text')){
        output << """"text":"${stories[randomNum]}","""
    } else     if(line.contains('id_str')){
        output << """"id_str":"${time.getTime()}" """
    } else{
        output << line
    }
    output << '\n'    
}
json.setText(output.getText())
output.delete()
