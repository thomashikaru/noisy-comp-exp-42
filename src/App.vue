<!-- Window is fixed, 102px, pointer cursor, gradual blurry effect on surrounding words. -->
<!--  Comprehension questions appear afterwards in the same slide -->

<template>
  <Experiment title="Reading Experiment" translate="no">
    <Screen
      :title="'Welcome'"
      class="instructions"
      :validations="{
        SubjectID: {
          minLength: $magpie.v.minLength(2),
        },
      }"
    >
      <!-- <WelcomeScreen /> -->
      <div style="width: 40em; margin: auto">
        <div style="background-color: lightgrey; padding: 10px">
          <b> Information About this Study </b>
        </div>
        <p>
          <br />

          <b>What is being investigated?</b> You are being asked to take part in
          a research study being done at the Massachusetts Institute of
          Technology. This study will help us learn about how people read. It
          will take you around 20 minutes to complete. <br /><br />

          <b>Who can participate?</b> You can participate only if you are an
          adult native speaker of English. <br /><br />

          <b>What am I supposed to do as a participant?</b> If you choose to be
          in the study, you will use the computer mouse to read sentences in
          English and answer questions about them. <br /><br />

          <b>What are my rights during participation?</b> Your participation in
          this study is voluntary. If you choose to participate, you may change
          your mind and leave the study at any time by closing the web page. You
          do not have to provide reasons. <br /><br />

          <b>What risks and benefits can I expect?</b> There are no foreseeable
          risks for participating in this study. <br /><br />

          <b>Will I be compensated for participating?</b> If you complete the
          experiment, you will be compensated for your time according to the
          amount specified on Prolific. <br /><br />

          <b>What data is collected from me and how is it used?</b> During this
          study, we will track the position of your mouse on screen. At the end
          of the study you will be asked to complete a brief survey. No
          personally identifying information will be collected. The data from
          this study may be presented at scientific conferences and published in
          scientific journals, as well as in online repositories. All data will
          remain anonymous. <br /><br />

          <b> Who reviewed this study? </b> This study's protocol has been
          approved by the MIT Committee on the Use of Humans as Experimental
          Subjects. <br /><br />

          <b> Contact: </b> Please feel free to contact us anonymously via
          Prolific Direct Message.
          <br />
        </p>

        <br />
        <div style="background-color: lightgrey; padding: 10px">
          <b> Consent Form </b>
        </div>
        <br />
        I, the participant, confirm by clicking the button below: <br />
        <div style="padding-left: 30px">
          • I have read and understood the study information above.
        </div>
        <div style="padding-left: 30px">
          • I comply with the inclusion and exclusion criteria for participation
          described above.
        </div>
        <div style="padding-left: 30px">
          • I have had enough time to decide about my participation.
        </div>
        <div style="padding-left: 30px">
          • I participate in this study voluntarily and consent that my personal
          data be used as described above.
        </div>
        <div style="padding-left: 30px">
          • I understand that I can stop participating at any moment.
        </div>
        <br />

        <tr>
          <td>Please enter your Prolific ID to continue:&nbsp;</td>
          <td>
            <input
              name="TurkID"
              type="text"
              class="obligatory"
              v-model="$magpie.measurements.SubjectID"
            />
          </td>
        </tr>
        <tr></tr>
      </div>
      <div
        v-if="
          $magpie.measurements.SubjectID &&
          !$magpie.validateMeasurements.SubjectID.$invalid
        "
      >
        <br />
        By clicking on the button below you consent to participating in this
        study:
        <!-- <br /> -->
        <button
          @click="
            $magpie.addExpData({ SubjectId: $magpie.measurements.SubjectID });
            $magpie.nextScreen();
          "
        >
          Proceed
        </button>
      </div>
    </Screen>

    <InstructionScreen :title="'Instructions'">
      <p>
        In this study, you will read sentences. Unlike in normal reading,
        however, the texts will be blurred. In order to bring the text into
        focus, move your mouse over it. When you are done reading, click the
        'Done Reading' button.
      </p>
    </InstructionScreen>

    <InstructionScreen :title="'Instructions'">
      <p>
        As you read, you may notice that some of the sentences contain mistakes.
        An error could be a grammar error, typo, missing/extra words, etc.
      </p>
      <p>
        After reading each sentence, you will be asked whether the sentence
        contained any mistakes. Indicate your choice by pressing the appropriate
        button. Note: for the purposes of this study, everything is in lower
        case. Please don't mark something as wrong if capitalization is the only
        issue.
      </p>
      <p>Press the button to start the study.</p>
    </InstructionScreen>

    <template v-for="(trial, i) of trials">
      <Screen :key="i" class="main_screen" :progress="i / trials.length">
        <Slide>
          <form>
            <input type="hidden" class="item_id" :value="trial.item_id" />
            <input
              type="hidden"
              class="experiment_id"
              :value="trial.experiment_id"
            />
            <input
              type="hidden"
              class="condition_id"
              :value="trial.condition_id"
            />
          </form>
          <div class="oval-cursor"></div>

          <template>
            <div>Sentence {{ i + 1 }} of {{ trials.length }}</div>
          </template>

          <div
            v-if="showFirstDiv"
            class="readingText"
            @mousemove="moveCursor"
            @mouseleave="changeBack"
          >
            <template v-for="(word, index) of trial.text.split(' ')">
              <span :key="index" :data-index="index">
                {{ word }}
              </span>
            </template>
          </div>

          <div
            class="blurry-layer"
            style="
              opacity: 0.3;
              filter: blur(5px);
              transition: all 0.3s linear 0s;
            "
          >
            {{ trial.text }}
          </div>

          <div style="height: 75px"></div>

          <div>
            <button
              v-if="showFirstDiv"
              @click="toggleDivs"
              :disabled="!isCursorMoving"
            >
              Done Reading
            </button>
          </div>

          <div v-if="!showFirstDiv" class="userInput">
            <p>
              Please indicate whether the sentence was OK or whether you think
              it contained an error. You can also indicate that you're not sure.
              Remember, please disregard capitalization.
            </p>
            <MultipleChoiceInput
              :response.sync="$magpie.measurements.response"
              :options="['I noticed an error', 'Not sure', 'Sentence was OK']"
            />
          </div>

          <button
            v-if="$magpie.measurements.response"
            @click="
              toggleDivs();

              const subject_id = $magpie.getAllData()[0].SubjectId;

              $magpie.addTrialData({
                TrialId: i,
                ItemId: trial.item_id,
                Condition: trial.condition_id,
                Experiment: trial.experiment_id,
                TrialText: trial.text,
                TrialType: `textInputInference`,
                userResponse: $magpie.measurements.response,
              });

              const data = $magpie.getAllData();
              const data_filt = data.filter(
                (obj) =>
                  Number(obj.ItemId) === trial.item_id &&
                  obj.Condition === trial.condition_id
              );
              data_filt[0].SubjectId = subject_id;

              $magpie.submitResults($magpie.submissionUrl, data_filt);
              $magpie.nextScreen();
            "
          >
            Next Trial
          </button>
        </Slide>
      </Screen>
    </template>

    <Screen>
      <p>1. Which input device are you using for this experiment?</p>
      <MultipleChoiceInput
        :response.sync="$magpie.measurements.device"
        orientation="horizontal"
        :options="['Computer Mouse', 'Computer Trackpad', 'Other']"
      />
      <br />
      <br />
      <p>2. Which hand are you using during this experiment?</p>
      <MultipleChoiceInput
        :response.sync="$magpie.measurements.hand"
        orientation="horizontal"
        :options="['Left', 'Right', 'Both']"
      />
      <br />
      <br />
      <p>
        What did you think about the experiment? Please describe how hard or
        easy the task felt, anything you noticed about the sentences, or any
        other thoughts you have. If anything was confusing or frustrating,
        please feel free to let us know!
      </p>
      <TextareaInput :response.sync="$magpie.measurements.response" />

      <button
        style="bottom: 30%; transform: translate(-50%, -50%)"
        @click="$magpie.saveAndNextScreen()"
      >
        Submit
      </button>
    </Screen>

    <Screen>
      <p>
        The next screen will submit your results and display your completion
        code.
      </p>

      <button
        style="bottom: 30%; transform: translate(-50%, -50%)"
        @click="
          const data = $magpie.getAllData();
          const subject_id = data[0].SubjectId;
          const last_trial = data[data.length - 1];
          const updated_last_trial = [{ ...last_trial, SubjectId: subject_id }];
          // $magpie.submitResults($magpie.submissionUrl, updated_last_trial);
          $magpie.nextScreen();
        "
      >
        Continue
      </button>
    </Screen>

    <!-- <SubmitResultsScreen /> -->

    <Screen :title="'Study Complete'">
      <p class="selectable-text" style="font-size: 24px">Completion Code:</p>
      <p class="selectable-text" style="font-size: 24px">C101RMLG</p>
    </Screen>
  </Experiment>
</template>

<script>
// Load data from csv files as javascript arrays with objects
import list1 from "../trials/motr_materials.csv";
import fillers from "../trials/motr_fillers.csv";
import _ from "lodash";

export default {
  name: "App",
  data() {
    const showImages = false;

    // Create an array with 4 repeats of each value
    const implausibleConditions = _.flatMap(
      [
        // "1_short_implausible",
        // "2_short_implausible",
        "1_long_implausible",
        "2_long_implausible",
      ],
      (value) => _.times(4, () => value)
    );

    const plausibleConditions = _.flatMap(
      [
        // "1_short_plausible",
        // "2_short_plausible",
        "1_long_plausible",
        "2_long_plausible",
      ],
      (value) => _.times(13, () => value)
    );

    const shuffledConditions = _.shuffle(
      implausibleConditions.concat(plausibleConditions)
    );

    const updatedItems = _.shuffle(list1).map((trial, idx) => {
      var col = shuffledConditions[idx];
      return {
        ...trial,
        item_id: trial["Item"],
        text: trial[col],
        condition_id: col,
        experiment_id: "ncgp",
      };
    });

    const updatedFillers = fillers.map((trial, idx) => {
      return {
        item_id: trial["Item"],
        text: trial["Sentence"],
        condition_id: "filler",
        experiment_id: "ncgp",
      };
    });

    // get five clean fillers to ensure we show first -- removes them from the original list
    const updatedFillersCleanPreview = updatedFillers.splice(6, 5);

    // console.log(updatedFillers);

    const updatedShuffledItems = updatedFillersCleanPreview.concat(
      _.shuffle(updatedItems.concat(updatedFillers))
    );
    // const updatedShuffledItems = updatedFillersCleanPreview.concat(
    //   _.sampleSize(_.shuffle(updatedItems.concat(updatedFillers)), 5)
    // );

    // debugging
    // console.log(updatedShuffledItems);

    return {
      isCursorMoving: false,
      trials: updatedShuffledItems,
      currentIndex: null,
      showFirstDiv: true,
      mousePosition: {
        x: 0,
        y: 0,
      },
      userResponse: "",
      showImages: showImages,
    };
  },
  computed: {
    console: () => console,
    window: () => window,
  },
  mounted() {
    setInterval(this.saveData, 50);
  },
  methods: {
    changeBack() {
      this.$el.querySelector(".oval-cursor").classList.remove("grow");
      this.$el.querySelector(".oval-cursor").classList.remove("blank");
      this.currentIndex = null;
    },
    saveData() {
      if (this.currentIndex !== null) {
        const currentElement = this.$el.querySelector(
          `span[data-index="${this.currentIndex}"]`
        );
        if (currentElement) {
          const currentElementRect = currentElement.getBoundingClientRect();
          $magpie.addTrialData({
            Experiment: this.$el.querySelector(".experiment_id").value,
            Condition: this.$el.querySelector(".condition_id").value,
            ItemId: this.$el.querySelector(".item_id").value,
            Index: this.currentIndex,
            Word: currentElement.innerHTML,
            mousePositionX: this.mousePosition.x,
            mousePositionY: this.mousePosition.y,
            wordPositionTop: currentElementRect.top,
            wordPositionLeft: currentElementRect.left,
            wordPositionBottom: currentElementRect.bottom,
            wordPositionRight: currentElementRect.right,
            // wordPositionTop: currentElement.offsetTop,
            // wordPositionLeft: currentElement.offsetLeft,
            // wordPositionBottom: currentElement.offsetHeight + currentElement.offsetTop,
            // wordPositionRight: currentElement.offsetWidth + currentElement.offsetLeft
          });
        } else {
          $magpie.addTrialData({
            Experiment: this.$el.querySelector(".experiment_id").value,
            Condition: this.$el.querySelector(".condition_id").value,
            ItemId: this.$el.querySelector(".item_id").value,
            Index: this.currentIndex,
            mousePositionX: this.mousePosition.x,
            mousePositionY: this.mousePosition.y,
          });
        }
      }
    },
    moveCursor(e) {
      this.isCursorMoving = true;
      this.$el.querySelector(".oval-cursor").classList.add("grow");
      let x = e.clientX;
      let y = e.clientY;
      const elementAtCursor = document.elementFromPoint(x, y).closest("span");
      if (elementAtCursor) {
        this.$el.querySelector(".oval-cursor").classList.remove("blank");
        this.currentIndex = elementAtCursor.getAttribute("data-index");
      } else {
        this.$el.querySelector(".oval-cursor").classList.add("blank");
        const elementAboveCursor = document
          .elementFromPoint(x, y - 3)
          .closest("span");
        if (elementAboveCursor) {
          this.currentIndex = elementAboveCursor.getAttribute("data-index");
        } else {
          this.currentIndex = -1;
        }
      }

      this.$el.querySelector(".oval-cursor").style.left = `${x + 12}px`;
      this.$el.querySelector(".oval-cursor").style.top = `${y - 6}px`;
      this.mousePosition.x = e.clientX;
      this.mousePosition.y = e.clientY;
      // this.mousePosition.x = e.offsetX;
      // this.mousePosition.y = e.offsetY;
    },
    toggleDivs() {
      this.showFirstDiv = !this.showFirstDiv;
      this.isCursorMoving = false;
    },
    getScreenDimensions() {
      return {
        window_inner_width: window.innerWidth,
        window_inner_height: window.innerHeight,
      };
    },
  },
};
</script>

<style>
.experiment {
  display: flex;
  align-items: center;
  justify-content: center;
}
.main_screen {
  isolation: isolate;
  position: relative;
  width: 100%;
  height: auto;
  font-size: 18px;
  line-height: 40px;
}
.debugResults {
  width: 100%;
}
.readingText {
  /* z-index: 1; */
  position: absolute;
  color: white;
  text-align: left;
  font-weight: 450;
  cursor: pointer;
  padding-top: 2%;
  padding-bottom: 2%;
  padding-left: 11%;
  padding-right: 11%;
}
.userInput {
  padding-top: 2%;
  padding-bottom: 2%;
  padding-left: 20%;
  padding-right: 20%;
}
button {
  /* position: absolute; */
  /* bottom: 0; */
  left: 50%;
}
.oval-cursor {
  position: fixed;
  z-index: 2;
  width: 1px;
  height: 1px;
  transform: translate(-50%, -50%);
  background-color: white;
  mix-blend-mode: difference;
  border-radius: 50%;
  pointer-events: none;
  transition: width 0.5s, height 0.5s;
}
.oval-cursor.grow.blank {
  width: 80px;
  height: 13px;
}
.oval-cursor.grow {
  width: 102px;
  height: 38px;
  border-radius: 50%;
  box-shadow: 30px 0 8px -4px rgba(255, 255, 255, 0.1),
    -30px 0 8px -4px rgba(255, 255, 255, 0.1);
  background-color: rgba(255, 255, 255, 0.3);
  background-blend-mode: screen;
  pointer-events: none;
  transition: width 0.5s, height 0.5s;
  filter: blur(3px);
}
.oval-cursor.grow::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 70%;
  height: 70%;
  background-color: white;
  mix-blend-mode: normal;
  border-radius: 50%;
}
.blurry-layer {
  position: absolute;
  pointer-events: none;
  color: black;
  text-align: left;
  font-weight: 450;
  padding-top: 2%;
  padding-bottom: 2%;
  padding-left: 11%;
  padding-right: 11%;
}

* {
  user-select: none; /* Standard syntax */
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
}
.selectable-text {
  -webkit-user-select: text; /* Chrome/Safari */
  -moz-user-select: text; /* Firefox */
  -ms-user-select: text; /* IE/Edge */
  user-select: text; /* standard */
}
</style>
