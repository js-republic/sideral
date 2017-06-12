"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var SideralObject_1 = require("./../SideralObject");
/**
 * Manager of skill of an Entity
 */
var SkillManager = (function (_super) {
    __extends(SkillManager, _super);
    function SkillManager() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * List of all skills
         */
        _this.skills = {};
        /**
         * Current skill launched
         */
        _this.currentSkill = null;
        /**
         * Last skill launched
         */
        _this.lastSkill = null;
        return _this;
    }
    /* METHODS */
    /**
     * Add a new skill
     * @param name - Name of the skill
     * @param skill - Object instance of Skill corresponding of the name
     * @returns The skill created
     */
    SkillManager.prototype.addSkill = function (name, skill) {
        skill.name = name;
        skill.owner = this.parent;
        skill.signals.skillComplete.add(this._onSkillComplete.bind(this));
        return this.skills[name] = this.add(skill);
    };
    /**
     * Get a skill
     * @param name - Name of the skill
     * @returns The skill (or null if the skill doesn't exist)
     */
    SkillManager.prototype.get = function (name) {
        return this.skills[name];
    };
    /**
     * Check if the skill with the name passed in parameter is running
     * @param name - Name of the skill
     * @returns Know if the skill is running
     */
    SkillManager.prototype.isRunning = function (name) {
        return this.currentSkill && this.currentSkill[name] === this.skills[name] && this.currentSkill.active;
    };
    /**
     * Run a skill
     * @param {string} name: name of the skill
     * @param {Object=} props: properties to add for the run
     * @returns {Boolean} Return true if the skill has ben launched
     */
    SkillManager.prototype.run = function (name, props) {
        var skill = this.get(name);
        if (!skill || (skill && !skill.ready) || (this.currentSkill && this.currentSkill.unstoppable)) {
            return false;
        }
        if (this.currentSkill) {
            this.currentSkill.stop();
        }
        this.currentSkill = skill;
        this.currentSkill.run(props);
        return true;
    };
    /**
     * Remove a skill by its name
     * @param {string} name: name of the skill
     * @returns {void}
     */
    SkillManager.prototype.remove = function (name) {
        delete this.skills[name];
    };
    /* PRIVATE */
    /**
     * When a skill is complete
     * @param {Skill} skill: skill
     * @returns {void}
     * @private
     */
    SkillManager.prototype._onSkillComplete = function (skill) {
        if (this.currentSkill.name === skill.name) {
            this.currentSkill = null;
        }
        this.lastSkill = skill;
    };
    return SkillManager;
}(SideralObject_1.SideralObject));
exports.SkillManager = SkillManager;
