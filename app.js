// Vue.filter('date',time=>moment(time).format('DD/MM/YY, HH:mm'));
new Vue({
    el: '#notebook',
    data() {
        return {
            // content: "This is a notebook.",
            notes: JSON.parse(localStorage.getItem('notes')) || [],
            selectedId: localStorage || null, //选中笔记的ID
        };
    },
    computed: {
        notePreview(){
            return this.selectedNote ? marked(this.selectedNote.content) : ''
        },
        addButtonTitle(){
            return this.notes.length + ' note(s) already'; 
        },
        selectedNote(){
            return this.notes.find(note => note.id === this.selectedId);
        },
        sortedNotes() {
            return this.notes.slice()
                        .sort((a,b) => a.created - b.created)
                        .sort((a,b) => (a.favorite === b.favorite) ? 0 
                                        : (a.favorite ? -1 : 1) )
        },
        linesCounts() {
            if( this.selectedNote){
                return this.selectedNote.content.split(/\r\n|\r|\n/).length;
            }
        },
        wordsCount(){
            if( this.selectedNote){
                var s = this.selectedNote.content;
                s = s.replace(/\n/g,' ');
                s = s.replace(/(^\s*)|(\s*$)/gi,'');
                s = s.replace(/\s\s+/,' ');
                return s.split(' ').length;
            }
        },
        charactersCount(){
            if(this.selectedNote){
                return this.selectedNote.content.split('').length;
            }
        }

        
    },
    watch: {
        // content: {
        //     handler: 'saveNote'
        // }
        notes: {
            handler: 'saveNotes',
            deep: true
        },
        selectedId: {
            handler(val){
                localStorage.setItem('selected-id',val);
            }
        }
    },
    methods: {
        // saveNote(val){//保存一条笔记
        //     console.log('saving note', val);
        //     localStorage.setItem('content',val);
        // },
        saveNotes(){
            localStorage.setItem('notes',JSON.stringify(this.notes));
            console.log('Notes saved!', new Date());
        }
        ,
        reportOperation(opName){ //提示用
            console.log('The', opName,'opreation was completed!');
        },
        addItem(){//用一些默认值添加一条笔记，并创建到数组内
            const time = Date.now();
            const note = {
                id: String(time),
                title: 'New note' + (this.notes.length + 1),
                content: 'This is a default Note.',
                created: time,
                favorite: false, //是否收藏 
            };
            this.notes.push(note);//添加到列表
            console.log(this.notes);
        },
        selectNote (note) {
            this.selectedId = note.id;
        },
        removeNote(){
            if(this.selectedNote && confirm('Delete the note?')){
                const index = this.notes.indexOf(this.selectedNote);
                console.log(index);
                if( index !== -1){
                    this.notes.splice(index,1);
                    console.log(this.notes);
                }
            }
        },
        favoriteNote(){
            this.selectedNote.favorite = !this.selectedNote.favorite;
        }
    },
    created(){
        this.content = localStorage.getItem('content') || 'you can write in here';
    },
   filters: {
       date(time){
           return moment(time).format('YYYY/MM/DD, HH:mm');
       }
   }
});