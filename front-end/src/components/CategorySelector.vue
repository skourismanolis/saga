<template>
<b-container>
  <div class="btn-group"  data-toggle="button" >
    <div v-for="opt in options" :key="opt.text"
    :style="'border-radius:0'"
    >
    <label class="btn"
      :style="getTagStyle(options.indexOf(opt))" 
      style="border-right: 0px; border-left:0px; border-radius:0px;"
    >
      
      <input v-model="selected"
        type="radio"
        name="options"
        id="options-group-1"
        autocomplete="off"
        :value="opt.text"
        checked
        style="appearance:none;"
      >
      {{opt.text}}
    
    </label>
    </div>
    <label class="btn"
      style="border-radius:0px;
      border-top:12px solid grey;
      margin-left:6px;"
      @click="addTag"
    >
  +
  </label>
  </div>
</b-container>
</template>

<script>
export default {
  //prop #SOMECOLOR print
  data() {
      return {
        colors: ['orange','darkred','purple','black','darkblue'],
        selected: 'null',
        options: [
          { text: 'Front-end', value: 'first', color:'yellow' },
          { text: 'Back-end', value: 'second',color:'red' },
          { text: 'Design', value: 'third', color:'purple' },
          { text: 'API Client', value: 'fourth', color: 'black' },
          { text: 'Kalimba', value: 'fifth', color:'blue' },
        ],
        new: { text: '', value: '', color:'' }
      }

  },
  computed:{
    /*colors(){
      let i=0;
      for (i;i<this.options.length;i++){
        this.colors.push(this.options[i].color);
      }
    }*/
  },
  methods:{
    getTagStyle(index){
      return (
        //" background-color:" + 
        //border: 5px solid red;
        " border-top: 12px solid " + 
        this.colors[index] + 
        ";"
      )
    },
    addTag() {
        this.selected=true;
      }
  }

}
</script>

<style>

label.btn{
   display: inline-block;
  line-height: 1.25;
  color: rgb(54, 54, 54);
  text-align: center;
   text-decoration: none;
  vertical-align: middle;
  cursor: pointer;
  font-weight:500;
  font-size: 1.25rem;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  padding-top:0px;
  word-wrap: break-word;
}


.btn:hover{
    border-bottom: 6px solid black;
    background-color: rgb(148, 117, 221);
}
label.btn:hover {
  color: rgb(255, 255, 255);
}

.btn-group{
  margin:12px;
}

</style>