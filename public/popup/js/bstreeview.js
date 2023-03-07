/*! @preserve
 * bstreeview.js
 * Version: 1.2.1
 * Authors: Sami CHNITER <sami.chniter@gmail.com>
 * Copyright 2020
 * License: Apache License 2.0
 *
 * Project: https://github.com/chniter/bstreeview
 * Project: https://github.com/nhmvienna/bs5treeview (bootstrap 5)
 */
; (function ($, window, document, undefined) {
    "use strict";
    /**
     * Default bstreeview  options.
     */
    var pluginName = "bstreeview",
        defaults = {
            expandIcon: 'fa fa-angle-down fa-fw',
            collapseIcon: 'fa fa-angle-right fa-fw',
            expandClass: 'show',
            indent: 1.25,
            parentsMarginLeft: '1.25rem',
            openNodeLinkOnNewTab: true
        };
    /**
     * bstreeview HTML templates.
     */
    var templates = {
        treeview: '<div class="bstreeview"></div>',
        treeviewItem: '<div role="treeitem" class="list-group-item d-flex justify-content-between align-items-center" data-toggle="collapse"><div></div></div>',
        treeviewGroupItem: '<div role="group" class="list-group collapse" id="itemid"></div>',
        treeviewGroupBadge: '<span class="badge badge-primary badge-pill"></span>',
        treeviewItemStateIcon: '<i class="state-icon"></i>',
        treeviewItemIcon: '<i class="item-icon"></i>',
        treeviewItemFavicon: '<img style="width:16px; height: 16px; margin-bottom: 2px" class="item-icon">',
        treeviewItemButtons: '<div class="btn-group pl-3"></div>',
        treeviewItemButton: '<button class="btn shadow-none pl-2 pr-0 pt-0 pb-0" type="button" style=" line-height: 14px;"><i></i></button>',
        treeviewSettingsSwitch: '<div class="custom-control custom-switch"><input type="checkbox" class="custom-control-input"></input><label class="custom-control-label"></label></div>'
    };

    /**
     * BsTreeview Plugin constructor.
     * @param {*} element
     * @param {*} options
     */
    function bstreeView(element, options) {
        this.element = element;
        this.itemIdPrefix = element.id + "-item-";
        this.settings = $.extend({}, defaults, options);
        this.init();
    }

    /**
     * Avoid plugin conflict.
     */
    $.extend(bstreeView.prototype, {
        /**
         * bstreeview intialize.
         */
        init: function () {
            this.tree = [];
            this.nodes = [];
            // Retrieve bstreeview Json Data.
            if (this.settings.data) {
                if (this.settings.data.isPrototypeOf(String)) {
                    this.settings.data = $.parseJSON(this.settings.data);
                }
                this.tree = $.extend(true, [], this.settings.data);
                delete this.settings.data;
            }
            // Set main bstreeview class to element.
            $(this.element).addClass('bstreeview');

            this.initData({ nodes: this.tree });
            var _this = this;
            this.build($(this.element), this.tree, 0);
            // Update angle icon on collapse
            $(this.element).on('click', '.list-group-item', function (e) {
                if (e.target.type === "button") {
                    e.stopImmediatePropagation()
                    return
                }
                $('.state-icon', this)
                    .toggleClass(_this.settings.expandIcon)
                    .toggleClass(_this.settings.collapseIcon);

                // Toggle the data-bs-target. Issue with Bootstrap toggle and dynamic code
                // $($(this).attr("data-bs-target")).collapse('toggle');
            });
        },
        /**
         * Initialize treeview Data.
         * @param {*} node
         */
        initData: function (node) {
            if (!node.nodes) return;
            var parent = node;
            var _this = this;
            $.each(node.nodes, function checkStates(index, node) {

                node.nodeId = _this.nodes.length;
                node.parentId = parent.nodeId;
                _this.nodes.push(node);

                if (node.nodes) {
                    _this.initData(node);
                }
            });
        },
        /**
         * Build treeview.
         * @param {*} parentElement
         * @param {*} nodes
         * @param {*} depth
         */
        build: function (parentElement, nodes, depth) {
            var _this = this;
            // Calculate item padding.
            var leftPadding = _this.settings.parentsMarginLeft;

            if (depth > 0) {
                leftPadding = (_this.settings.indent + depth * _this.settings.indent).toString() + "rem;";
            }
            depth += 1;
            // Add each node and sub-nodes.
            $.each(nodes, function addNodes(id, node) {
                // Main node element.
                var treeItem = $(templates.treeviewItem)
                    .attr('data-target', "#" + _this.itemIdPrefix + node.nodeId)
                    .attr('style', 'padding-left:' + leftPadding)
                    .attr('aria-level', depth);

                // Set Expand and Collapse icons.
                if (node.nodes) {
                    var treeItemStateIcon = $(templates.treeviewItemStateIcon)
                        .addClass((node.expanded) ? _this.settings.expandIcon : _this.settings.collapseIcon);
                    $(treeItem[0].children[0]).append(treeItemStateIcon);
                    treeItem[0].style.cursor = "pointer";
                }
                if (node.hide) {
                    treeItem.removeClass('d-flex')
                    treeItem.addClass('d-none')
                }
                // set node icon if exists.
                if (node.favicon) {
                    let treeItemFavicon = $(templates.treeviewItemFavicon)
                    treeItemFavicon[0].src = node.favicon
                    $(treeItem[0].children[0]).append(treeItemFavicon);
                } else if (node.icon) {
                    var treeItemIcon = $(templates.treeviewItemIcon)
                        .addClass(node.icon);
                    $(treeItem[0].children[0]).append(treeItemIcon);
                }
                // Set node Text.
                // Reset node href if present
                if (node.href) {
                    let text = document.createElement('a')
                    text.href = node.href
                    text.target = "_blank"
                    text.innerText = node.text
                    $(treeItem[0].children[0]).append(text);
                } else if (node.text) {
                    let text = document.createElement('span')
                    text.innerText = node.text
                    $(treeItem[0].children[0]).append(text);
                } else if (node.switch) {
                    let sw = $(templates.treeviewSettingsSwitch);
                    sw[0].firstChild.id = node.switch.id
                    sw[0].firstChild.disabled = node.switch.disabled
                    sw[0].firstChild.checked = node.switch.checked
                    $(sw[0].lastChild).attr('for', node.switch.id)
                    sw[0].lastChild.innerText = node.switch.text
                    if (node.switch.onchange) {
                        $(sw[0].firstChild).bind('change', node.switch.onchange)
                    }

                    $(treeItem[0].children[0]).append(sw);
                }
                if (node.text) {
                    treeItem.attr('text', node.text)
                }
                // Add class to node if present
                if (node.class) {
                    treeItem.addClass(node.class);
                }
                if (node.favorite) {
                    treeItem.attr('favorite', true);
                }
                // Add custom id to node if present
                if (node.id) {
                    treeItem.attr('id', node.id);
                }
                if (node.buttons) {
                    let buttons = $(templates.treeviewItemButtons);

                    treeItem.attr('type', node.favorite ? "favorite" : "supported");

                    node.buttons.forEach((b) => {
                        if (b) {
                            let button = $(templates.treeviewItemButton)
                            if (b.title) {
                                button[0].title = b.title
                            }
                            if (b.type) {
                                button.attr('type', b.type);
                            }
                            if (b.link) {
                                button.attr('link', b.link);
                            }
                            if (b.origin) {
                                button.attr('origin', b.origin);
                            }
                            if (b.siteId) {
                                button.attr('siteId', b.siteId);
                            }
                            if (b.onclick) {
                                button.bind('click', b.onclick)
                            }

                            $(button[0].children[0]).addClass(b.icon)
                            buttons.append(button)
                        }
                    })

                    treeItem.append(buttons);
                }
                // Attach node to parent.
                parentElement.append(treeItem);
                // Build child nodes.
                if (node.badge) {
                    let html = $(templates.treeviewGroupBadge)
                    html[0].innerText = node.badge
                    treeItem.append(html)
                }
                if (node.bigFixButton) {
                    let html = $(`<button type="button" class="btn btn-danger btn-sm"></button>`)
                    html[0].innerText = node.bigFixButton.text
                    html[0].style.display = node.bigFixButton.display

                    html.bind('click', node.bigFixButton.onclick)
                    treeItem.append(html)
                }
                if (node.nodes) {
                    // Node group item.
                    var treeGroup = $(templates.treeviewGroupItem)
                        .attr('id', _this.itemIdPrefix + node.nodeId);
                    parentElement.append(treeGroup);
                    _this.build(treeGroup, node.nodes, depth);
                    if (node.expanded) {
                        treeGroup.addClass(_this.settings.expandClass);
                    }
                }
            });
        }
    });

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" +
                    pluginName, new bstreeView(this, options));
            }
        });
    };
})(jQuery, window, document);
