export default class Homework {
  constructor($iframeContent) {
    this.$homeworkModal = $('#modal',window.parent.document);
    this.$questionPickedModal = $('#attachment-modal',window.parent.document);
    this.$element = $iframeContent;
    this.$step2_form = this.$element.find('#step2-form');
    this.$step3_form = this.$element.find('#step3-form');
    this.init();
  }

  init() {
    this.initEvent();
    this.initCkeditor();
    this.setValidateRule();
    this.inItStep2form();
  }

  initEvent() {
    this.$element.on('click', '[data-role="pick-item"]',event=>this.showPickQuestion(event));
    this.$questionPickedModal.on('shown.bs.modal',()=>{
      this.$homeworkModal.hide()
    });
    this.$questionPickedModal.on('hidden.bs.modal',()=>{
      this.$homeworkModal.show();
    });
  }

  initCkeditor() {
    let editor = CKEDITOR.replace('homework-about-field', {
      toolbar: 'Minimal',
      filebrowserImageUploadUrl: $('#homework-about-field').data('imageUploadUrl'),
    });
    editor.on( 'change', () => {    
      $('#homework-about-field').val(editor.getData());
    });
  }

  showPickQuestion(event) {
    event.preventDefault();
    let $btn = $(event.currentTarget);
    let excludeIds = [];
    $("#question-table-tbody").find('[name="questionIds[]"]').each(function() {
      excludeIds.push($(this).val());
    });
    this.$questionPickedModal.modal().data('manager', this);
    $.get($btn.data('url'), {
      excludeIds: excludeIds.join(',')
    }, html =>  {
      this.$questionPickedModal.html(html);
    });
  }

  inItStep2form() {
    var validator = this.$step2_form.validate({
      onkeyup: false,
      rules: {
        title:{
          required:true
        },
        description: {
          required:true
        },
        'questionLength':{
          required:true
        },
      },
      messages: {
        'questionLength':"请选择题目",
      },
    });
    this.$step2_form.data('validator',validator);
  }

  setValidateRule() {
    $.validator.addMethod("arithmeticFloat",function(value,element){  
      return this.optional( element ) || /^[0-9]+(\.[0-9]?)?$/.test(value);
    }, $.validator.format("必须为正数，保留一位小数"));

    $.validator.addMethod("positiveInteger",function(value,element){  
      return this.optional( element ) || /^[1-9]\d*$/.test(value);
    }, $.validator.format("必须为正整数"));

    $.validator.addMethod("DateAndTime",function(value,element){  
      let reg = /^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29) ([0-1]{1}[0-9]{1})|(2[0-4]{1}):[0-5]{1}[0-9]{1}$/;
      return this.optional( element ) || reg.test(value);
    }, $.validator.format("请输入正确的日期和时间,格式如XXXX-MM-DD hh:mm"));
  }
}