var QuizController = (function(){

    function Question(id, questionText, options, correctAnswer){
        this.id = id;
        this.questionText = questionText;
        this.options = options;
        this.correctAnswer = correctAnswer;
    }

    var questionLocalStorage = {
        addQuestionCollection: function(newQuestionCollection){
            localStorage.setItem("QuestionCollection", JSON.stringify(newQuestionCollection))
        },
        getQuestionCollection: function(){
            return JSON.parse(localStorage.getItem("QuestionCollection"))
        },
        removeQuestionCollection: function(){
            localStorage.removeItem("QuestionCollection");
        }
    }


    return {
        addQuestionToLocalStorage: function(newQuestionText, opts){
            var questionId, qustText, ansOpts, corrAns, questCollection, isChecked;
            questionId = 0;
            ansOpts = [];


            qustText = newQuestionText.value;

            if(qustText !== ""){
                for(var i=0; i<opts.length; i++){
                    if(opts[i].value !== ""){
                        ansOpts.push(opts[i].value);
                    }
                    if(opts[i].value !== "" && opts[i].previousElementSibling.checked === true){
                        corrAns = opts[i].value;
                        isChecked = true;
                    }
                }
                if(ansOpts.length >= 2){
                    if(isChecked){
                        questCollection = questionLocalStorage.getQuestionCollection();
    
                        if(questCollection !== null){
                            questionId = questCollection[questCollection.length - 1]["id"] + 1;
                        }else{
                            questCollection = [];
                            questionId = 0;
                        }
    
                        var newQust = new Question(questionId, qustText, ansOpts, corrAns);
                        questCollection.push(newQust);
                        questionLocalStorage.addQuestionCollection(questCollection);

                        newQuestionText.value = "";
                        for(var x=0; x<opts.length; x++){
                            opts[x].value = "";
                            opts[x].previousElementSibling.checked = false;
                        }

                    }else{
                        alert("Please select correct anwer");
                    }
                }else{
                    alert("Please enter atleast 2 options");
                }
            }else{
                alert("Please enter question");
            }
        }
    }
})();


var UIController = (function(){
    domItems = {
        questInsertBtn: document.querySelector("#question-insert-btn"),
        newQuestionText: document.querySelector("#new-question-text"),
        answerOptions: document.querySelectorAll(".admin-option"),
        optionsContainer: document.querySelector(".admin-options-container"),
        adminOptions: document.querySelectorAll(".admin-option-wrapper")
    }
    return {
        getDomItems: domItems,
        addInputsDynamically: function(){
            var addInput = function(){
                var optionCount;
                optionCount = domItems.adminOptions.length;
                var newOptionInput =  '<div class="admin-option-wrapper"><input type="radio" class="admin-option-'+optionCount+'" name="answer" value="'+optionCount+'"><input type="text" class="admin-option admin-option-'+optionCount+'" value=""></div>';
                domItems.optionsContainer.insertAdjacentHTML("beforeend",newOptionInput);
                domItems.optionsContainer.lastElementChild.previousElementSibling.lastElementChild.removeEventListener("focus", addInput);
                domItems.optionsContainer.lastElementChild.lastElementChild.addEventListener("focus", addInput);
            }
            domItems.optionsContainer.lastElementChild.lastElementChild.addEventListener("focus", addInput);            
        }
    }
})();



var controller = (function(quizCtrl, uiCtrl){
    var selectedDoms = uiCtrl.getDomItems;
    uiCtrl.addInputsDynamically();
    selectedDoms.questInsertBtn.addEventListener("click", function(){
       quizCtrl.addQuestionToLocalStorage(uiCtrl.getDomItems.newQuestionText, uiCtrl.getDomItems.answerOptions); 
    });

})(QuizController, UIController);