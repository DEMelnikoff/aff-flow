

const exp = (function() {


    var p = {};

   /*
    *
    *   CONDITION ASSIGNMENT    
    *
    */


    let settings = {
        dv: 'flow',
    };

    if (settings.dv == 'happiness') {
        settings.dvText = '<strong>happy</strong> you currently feel';
    } else {
        settings.dvText = '<strong>immersed and engaged</strong> you felt while spinning the previous wheel';
    };

    jsPsych.data.addProperties({
        dv: settings.dv,
    });

    console.log(settings.dv)


   /*
    *
    *   INSTRUCTIONS
    *
    */

    const html = {
        intro_preChk: [
            `<div class='parent'>
                <p><strong>Welcome to Spin the Wheel!</strong></p>
                <p>In Spin the Wheel, you'll spin a series of prize wheels.</p>
                <p>Each time you spin a prize wheel, you'll earn points.
                <br>The number of points you earn depends on where the wheel lands.</p>
                <p>Your goal is to earn as many points as possible by spinning the prize wheels!</p>
            </div>`,

            `<div class='parent'>
                <p>To spin a prize wheel, just grab it with your cursor and give it a spin!
                <br>Watch the animation below to see how it's done.</p>
                <img src="./img/spinGif.gif" style="width:60%; height:60%">
            </div>`,

            `<div class='parent'>
                <p>There are 18 prize wheels in total.<br>You will spin each prize wheel 5 times before continuing to the next wheel.</p>
                <p>After spinning a wheel 5 times, you'll answer a question about your feelings.</br>
                Specifically, you'll report how ${settings.dvText}.</p>
            </div>`],

        intro_postChk: [
            `<div class='parent'>
                <p>You're ready to start playing Spin the Wheel!</p>
                <p>Continue to the next screen to begin.</p>
            </div>`,      
        ],

        postTask: [
            `<div class='parent'>
                <p>Spin the Wheel is now complete!</p>
                <p>To finish this study, please continue to answer a few final questions.</p>
            </div>`
        ],
    };

    function MakeIntro(settings) {

        const intro_preChk = {
            type: jsPsychInstructions,
            pages: html.intro_preChk,
            show_clickable_nav: true,
            post_trial_gap: 500,
        };

        const intro_postChk = {
            type: jsPsychInstructions,
            pages: html.intro_postChk,
            show_clickable_nav: true,
            post_trial_gap: 500,
        };

        let correctAnswers = [`5`];

        if (settings.dv == 'flow') {
            correctAnswers.push(`My level of immersion and engagement.`);
        } else if (settings.dv == 'happiness') {
            correctAnswers.push(`My level of happiness.`);
        };

        const errorMessage = {
            type: jsPsychInstructions,
            pages: [`<div class='parent'><p>You provided the wrong answer.<br>To make sure you understand Spin the Wheel, please continue to re-read the instructions.</p></div>`],
            show_clickable_nav: true,
            allow_keys: false,
        };

        const attnChk = {
            type: jsPsychSurveyMultiChoice,
            preamble: `<div class='parent'>
                <p>Please answer the following questions.</p>
                </div>`,
            questions: [
                {
                    prompt: "How many times will you spin each wheel before continuing to the next wheel?", 
                    name: `attnChk1`, 
                    options: [`1`, `2`, `5`, `10`, `20`],
                },
                {
                    prompt: "What will you be answering questions about?", 
                    name: `attnChk2`, 
                    options: [`My level of happiness.`, `My level of immersion and engagement.`],
                },
            ],
            scale_width: 500,
            on_finish: (data) => {
                  const totalErrors = getTotalErrors(data, correctAnswers);
                  data.totalErrors = totalErrors;
            },
        };

        const conditionalNode = {
          timeline: [errorMessage],
          conditional_function: () => {
            const fail = jsPsych.data.get().last(1).select('totalErrors').sum() > 0 ? true : false;
            return fail;
          },
        };

        const instLoop = {
          timeline: [intro_preChk, attnChk, conditionalNode],
          loop_function: () => {
            const fail = jsPsych.data.get().last(2).select('totalErrors').sum() > 0 ? true : false;
            return fail;
          },
        };

        const introTimeline = {
            timeline: [instLoop, intro_postChk],
        }

        this.timeline = [introTimeline];
    }

    p.consent = {
        type: jsPsychExternalHtml,
        url: "./html/consent.html",
        cont_btn: "advance",
    };

    p.intro = new MakeIntro(settings);

    
   /*
    *
    *   TASK
    *
    */


    // define each wedge
    const wedges = {
        two: {color:"#800001", label:"2"},
        four: {color:"#803400", label:"4"},
        five: {color:"#ffd800", label:"5"},
        six: {color:"#806b00", label:"6"},
        seven: {color:"#00fe21", label:"7"},
        eight: {color:"#007f0e", label:"8"},
        nine: {color:"#0094fe", label:"9"},
        eleven: {color:"#0026ff", label:"11"},


        one: {color:"#fe0000", label:"1"},
        three: {color:"#fe6a00", label:"3"},
        ten: {color:"#00497e", label:"10"},
        twelve: {color:"#001280", label:"12"},
    };


    // define each wheel
    const wheels = [

     

        /*  2 2
            4 4 5 5    ev = 4.5; mad = 0.5
            8 8 9 9    ev = 8.5; mad = 0.5
            2 2 7 7    ev = 4.5; mad = 2.5
            6 6 11 11  ev = 8.5; mad = 2.5
        */
            {sectors: [ wedges.four, wedges.four, wedges.five, wedges.five ], ev: 4.5, mad: .5, mi: 1},
            {sectors: [ wedges.eight, wedges.eight, wedges.nine, wedges.nine ], ev: 8.5, mad: 2.5, mi: 1},
            {sectors: [ wedges.two, wedges.two, wedges.seven, wedges.seven ], ev: 4.5, mad: .5, mi: 1},
            {sectors: [ wedges.five, wedges.five, wedges.twelve, wedges.twelve ], ev: 8.5, mad: 2.5, mi: 1},

        /*  4
            5 5 5 5 5   ev = 5; v = 0
            9 9 9 9 9   ev = 9; v = 0
        */
            {sectors: [ wedges.one, wedges.one, wedges.one, wedges.one ], ev: 1, mad: 0, mi: 0},
            {sectors: [ wedges.three, wedges.three, wedges.three, wedges.three ], ev: 3, mad: 0, mi: 0},
            {sectors: [ wedges.ten, wedges.ten, wedges.ten, wedges.ten ], ev: 10, mad: 0, mi: 0},
            {sectors: [ wedges.twelve, wedges.twelve, wedges.twelve, wedges.twelve ], ev: 12, mad: 0, mi: 0},
        ];


    let scoreTracker = 0; // track current score
    let outcome = 0; // track outcome of each spin
    let round = 1;  // track current round

    const makeTokenArray = function() { return jsPsych.randomization.repeat(['plus', 'minus', 'normal', 'normal', 'normal'], 1) };

    let tokenArray = makeTokenArray();

    // trial: spinner
    const spin = {
        type: jsPsychCanvasButtonResponse,
        stimulus: function(c, spinnerData) {
            createSpinner(c, spinnerData, scoreTracker, jsPsych.timelineVariable('sectors'));
        },
        canvas_size: [500, 500],
        score: function() {
            return scoreTracker
        },
        data: {ev: jsPsych.timelineVariable('ev'), var: jsPsych.timelineVariable('var'), arrangement: jsPsych.timelineVariable('arrangement')},
        on_finish: function(data) {
            data.round = round;
            scoreTracker = data.score;
            outcome = data.outcomes[0];
        }
    };

    const tokens = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: function() {
            let tokenFeedback = `<div class="play-area"><div class="win-text">+${outcome} Tokens</div>{extra-text}</div>`;
            const plusText = '<div class="plus-text">+5 Bonus</div>';
            const minusText = '<div class="minus-text">-5 Loss</div>';
            const bonusType = tokenArray.pop();
            if (bonusType == 'plus') {
                tokenFeedback = tokenFeedback.replace('{extra-text}', plusText);
            } else if (bonusType == 'minus') {
                tokenFeedback = tokenFeedback.replace('{extra-text}', minusText);
            } else {
                tokenFeedback = tokenFeedback.replace('{extra-text}', '');
            };
            return tokenFeedback;
        },
        choices: "NO_KEYS",
        trial_duration: 2000,
        data: {ev: jsPsych.timelineVariable('ev'), var: jsPsych.timelineVariable('var'), arrangement: jsPsych.timelineVariable('arrangement')},
        on_finish: function(data) {
            if (tokenArray.length == 0) {
                tokenArray = makeTokenArray();
            };
        },
    };

    // trial: flow DV
    const affect_pre = {
        type: jsPsychSurveyLikert,
        questions: [
            {prompt: `<p>You're about to spin the following wheel. After doing so, you'll see how many tokens you earned.</p>When you see how many tokens you earned, how positive or negative do you think you'll feel?`,
            name: `affect_pre`,
            labels: ['Extremely negative', 'Very negative', 'Moderately negative', 'Slightly negative', 'Neither positive nor negative', 'Slightly positive', 'Moderately positive', 'Very positive', 'Extremely positive']},
        ],
        randomize_question_order: false,
        scale_width: 700,
        data: {ev: jsPsych.timelineVariable('ev'), var: jsPsych.timelineVariable('var'), arrangement: jsPsych.timelineVariable('arrangement')},
        on_finish: function(data) {
            data.round = round;
            let scoreArray = jsPsych.data.get().select('score').values;
            let outcomesArray = jsPsych.data.get().select('outcomes').values;
            data.score = scoreArray[scoreArray.length - 1];
            data.outcomes = outcomesArray[outcomesArray.length - 1];
            saveSurveyData(data);
        }
    };

    const affect_post = {
        type: jsPsychSurveyLikert,
        questions: function() {
            const Qs = [
                {prompt: `<p>You landed on a ${outcome}. Next, you'll see how many tokens you earned.</p>When you see how many tokens you earned, how positive or negative do you think you'll feel?`,
                name: `affect_pre`,
                labels: ['Extremely negative', 'Very negative', 'Moderately negative', 'Slightly negative', 'Neither positive nor negative', 'Slightly positive', 'Moderately positive', 'Very positive', 'Extremely positive']},
            ];
            return Qs;
        },
        randomize_question_order: false,
        scale_width: 700,
        data: {ev: jsPsych.timelineVariable('ev'), var: jsPsych.timelineVariable('var'), arrangement: jsPsych.timelineVariable('arrangement')},
        on_finish: function(data) {
            data.round = round;
            let scoreArray = jsPsych.data.get().select('score').values;
            let outcomesArray = jsPsych.data.get().select('outcomes').values;
            data.score = scoreArray[scoreArray.length - 1];
            data.outcomes = outcomesArray[outcomesArray.length - 1];
            saveSurveyData(data);
        }
    };

    const flowMeasure = {
        type: jsPsychSurveyLikert,
        questions: [
            {prompt: `During the last round of Spin the Wheel,<br>to what extent did you feel immersed and engaged in what you were doing?`,
            name: `dv_value`,
            labels: ['0<br>A little', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10<br>Extremely']},
        ],
        randomize_question_order: false,
        scale_width: 600,
        data: {ev: jsPsych.timelineVariable('ev'), var: jsPsych.timelineVariable('var'), arrangement: jsPsych.timelineVariable('arrangement')},
        on_finish: function(data) {
            data.round = round;
            let scoreArray = jsPsych.data.get().select('score').values;
            let outcomesArray = jsPsych.data.get().select('outcomes').values;
            data.score = scoreArray[scoreArray.length - 1];
            data.outcomes = outcomesArray[outcomesArray.length - 1];
            saveSurveyData(data);
        }
    };

    // trial: happiness DV
    const happinessMeasure = {
        type: jsPsychSurveyLikert,
        questions: [
            {prompt: `How happy are you right now?`,
            name: `dv_value`,
            labels: ['0<br>Very unhappy', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10<br>Very happy']},
        ],
        randomize_question_order: false,
        scale_width: 600,
        data: {ev: jsPsych.timelineVariable('ev'), var: jsPsych.timelineVariable('var'), arrangement: jsPsych.timelineVariable('arrangement')},
        on_finish: function(data) {
            data.round = round;
            let scoreArray = jsPsych.data.get().select('score').values;
            let outcomesArray = jsPsych.data.get().select('outcomes').values;
            data.score = scoreArray[scoreArray.length - 2];
            data.outcomes = outcomesArray[outcomesArray.length - 2];
            saveSurveyData(data);
            round++;
        }
    };

    // flow proneness


    // timeline: main task

    let dv;
    if (settings.dv == "happiness") {
        dv = happinessMeasure;
    } else {
        dv = flowMeasure;
    };

    const wheelLoop = {
        timeline: [affect_pre, spin, affect_post, tokens],
        repetitions: 5,
    };

    p.task = {
        timeline: [spin],
        repetitions: 1,
        timeline_variables: wheels,
        randomize_order: true,
    };

   /*
    *
    *   Demographics
    *
    */

    p.demographics = (function() {


        const taskComplete = {
            type: jsPsychInstructions,
            pages: html.postTask,
            show_clickable_nav: true,
            post_trial_gap: 500,
        };

        const genFlowScale = ['-2<br>Totally<br>Disagree', '-1<br>Disagree', '0<br>Neither agree<br>nor disagree', '1<br>Agree', '2<br>Totally<br>Agree'];

        const flowGenQuestions = {
            type: jsPsychSurveyLikert,
            preamble:
                `<div style='padding-top: 50px; width: 900px; font-size:16px'>
                    <p>Please express the extent to which you disagree or agree with each statement.</p>
                </div>`,
            questions: [
                {
                    prompt: `I enjoy challenging tasks/activities that require a lot of focus.`,
                    name: `genFlow_1`,
                    labels: genFlowScale,
                    required: true,
                },
                {
                    prompt: `When I am focused on a task/activity, I quickly tend to forget my surroundings (other people, time, and place).`,
                    name: `genFlow_2`,
                    labels: genFlowScale,
                    required: true,
                },
                {
                    prompt: `I usually experience a good flow when I do something (things that are neither too easy nor too difficult for me).`,
                    name: `genFlow_3`,
                    labels: genFlowScale,
                    required: true,
                },
                {
                    prompt: `I have several different areas of interest.`,
                    name: `genFlow_4`,
                    labels: genFlowScale,
                    required: true,
                },
                {
                    prompt: `It is difficult for me to walk away from or quit a project I am currently working on.`,
                    name: `genFlow_5`,
                    labels: genFlowScale,
                    required: true,
                },
                {
                    prompt: `I become stressed in the face of difficult/challenging tasks.`,
                    name: `genFlow_6r`,
                    labels: genFlowScale,
                    required: true,
                },
                {
                    prompt: `It is difficult for me to maintain concentration over time.`,
                    name: `genFlow_7r`,
                    labels: genFlowScale,
                    required: true,
                },
                {
                    prompt: `I quickly become tired of the things I do.`,
                    name: `genFlow_8r`,
                    labels: genFlowScale,
                    required: true,
                },
                {
                    prompt: `I am usually satisfied with the results of my efforts across various tasks (I experience feelings of mastery).`,
                    name: `genFlow_9`,
                    labels: genFlowScale,
                    required: true,
                },
                {
                    prompt: `When I focus on something, I often forget to take a break.`,
                    name: `genFlow_10`,
                    labels: genFlowScale,
                    required: true,
                },
                {
                    prompt: `I get bored easily.`,
                    name: `genFlow_11r`,
                    labels: genFlowScale,
                    required: true,
                },
                {
                    prompt: `My daily tasks are exhausting rather than stimulating.`,
                    name: `genFlow_12r`,
                    labels: genFlowScale,
                    required: true,
                },
                {
                    prompt: `I develop an interest for most of the things I do in life.`,
                    name: `genFlow_13`,
                    labels: genFlowScale,
                    required: true,
                },
            ],
            randomize_question_order: false,
            scale_width: 500,
            on_finish: (data) => {
                saveSurveyData(data); 
            },
        };

        const gender = {
            type: jsPsychHtmlButtonResponse,
            stimulus: '<p>What is your gender?</p>',
            choices: ['Male', 'Female', 'Other'],
            on_finish: (data) => {
                data.gender = data.response;
            }
        };

        const age = {
            type: jsPsychSurveyText,
            questions: [{prompt: "Age:", name: "age"}],
            on_finish: (data) => {
                saveSurveyData(data); 
            },
        }; 

        const ethnicity = {
            type: jsPsychHtmlButtonResponse,
            stimulus: '<p>What is your race?</p>',
            choices: ['White / Caucasian', 'Black / African American','Asian / Pacific Islander', 'Hispanic', 'Native American', 'Other'],
            on_finish: (data) => {
                data.ethnicity = data.response;
            }
        };

        const english = {
            type: jsPsychHtmlButtonResponse,
            stimulus: '<p>Is English your native language?:</p>',
            choices: ['Yes', 'No'],
            on_finish: (data) => {
                data.english = data.response;
            }
        };  

        const finalWord = {
            type: jsPsychSurveyText,
            questions: [{prompt: "Questions? Comments? Complains? Provide your feedback here!", rows: 10, columns: 100, name: "finalWord"}],
            on_finish: (data) => {
                saveSurveyData(data); 
            },
        }; 

        const pid = {
            type: jsPsychSurveyText,
            questions: [{prompt: "Please enter your Prolific ID in the space below to receive payment.", rows: 1, columns: 50, name: "pid"}],
            on_finish: (data) => {
                saveSurveyData(data); 
            },
        }; 

        const demos = {
            timeline: [taskComplete, flowGenQuestions, gender, age, ethnicity, english, finalWord, pid]
        };

        return demos;

    }());


   /*
    *
    *   SAVE DATA
    *
    */

    p.save_data = {
        type: jsPsychPipe,
        action: "save",
        experiment_id: "3ea7j3v4FYxI",
        filename: filename,
        data_string: ()=>jsPsych.data.get().csv()
    };

    return p;

}());

const timeline = [exp.consent, exp.intro, exp.task, exp.demographics, exp.save_data];

jsPsych.run(timeline);
