package com.hfut.entity;


import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import java.util.List;

@JsonSerialize(include = JsonSerialize.Inclusion.NON_NULL)
public class ZTreeNode {

	private String id;
	private String tId;
	private String parentId;
	private String name;
	private String icon;
	private String Desc;
	private String iconSkin;
	private String url;
	private String target;
	private boolean isParent = true;
	private boolean open = false;
	private Boolean checked = false;
	private Integer childcount;
	private String iconOpen;
	private String iconClose;
	private List<ZTreeNode> children;
	private Integer count;
	// 每页显示多少个节点
	private Integer pageSize;
	// 默认的第一页页码
	private Integer pageCount = 0;
	// 是否需要分页
	private boolean needSplitPage;

	public String getDesc() {
		return Desc;
	}

	public void setDesc(String desc) {
		Desc = desc;
	}

	public ZTreeNode() {
	}

	public ZTreeNode(String tId, String name, boolean isParent) {
		super();
		this.tId = tId;
		this.name = name;
		this.isParent = isParent;
	}

	public ZTreeNode(String tId, String name, boolean isParent, String url) {
		super();
		this.tId = tId;
		this.name = name;
		this.isParent = isParent;
		this.url = url;
	}

	public String gettId() {
		return tId;
	}

	public void settId(String tId) {
		this.tId = tId;
	}

	public String getParentId() {
		return parentId;
	}

	public void setParentId(String parentId) {
		this.parentId = parentId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getIcon() {
		return icon;
	}

	public void setIcon(String icon) {
		this.icon = icon;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String getTarget() {
		return target;
	}

	public void setTarget(String target) {
		this.target = target;
	}

	public boolean getIsParent() {
		return isParent;
	}

	public void setIsParent(boolean isParent) {
		this.isParent = isParent;
	}

	public boolean getOpen() {
		return open;
	}

	public void setOpen(boolean open) {
		this.open = open;
	}

	public Boolean getChecked() {
		return checked;
	}

	public void setChecked(Boolean checked) {
		this.checked = checked;
	}

	public Integer getChildcount() {
		return childcount;
	}

	public void setChildcount(Integer childcount) {
		this.childcount = childcount;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getIconOpen() {
		return iconOpen;
	}

	public void setIconOpen(String iconOpen) {
		this.iconOpen = iconOpen;
	}

	public String getIconClose() {
		return iconClose;
	}

	public void setIconClose(String iconClose) {
		this.iconClose = iconClose;
	}

	public List<ZTreeNode> getChildren() {
		return children;
	}

	public void setChildren(List<ZTreeNode> children) {
		this.children = children;
	}

	public Integer getCount() {
		return count;
	}

	public void setCount(Integer count) {
		this.count = count;
	}

	/**
	 * @return the pageSize
	 */
	public Integer getPageSize() {
		return pageSize;
	}

	/**
	 * @param pageSize
	 *            the pageSize to set
	 */
	public void setPageSize(Integer pageSize) {
		this.pageSize = pageSize;
	}

	/**
	 * @return the pageCount
	 */
	public Integer getPageCount() {
		return pageCount;
	}

	/**
	 * @param pageCount
	 *            the pageCount to set
	 */
	public void setPageCount(Integer pageCount) {
		this.pageCount = pageCount;
	}

	/**
	 * @return the needSplitPage
	 */
	public boolean getNeedSplitPage() {
		return needSplitPage;
	}

	/**
	 * @param needSplitPage
	 *            the needSplitPage to set
	 */
	public void setNeedSplitPage(boolean needSplitPage) {
		this.needSplitPage = needSplitPage;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see java.lang.Object#toString()
	 */

	@Override
	public String toString() {
		return "ZTreeNode [id=" + id + ", tId=" + tId + ", parentId="
				+ parentId + ", name=" + name + ", icon=" + icon + ", url="
				+ url + ", target=" + target + ", isParent=" + isParent
				+ ", open=" + open + ", checked=" + checked + ", childcount="
				+ childcount + ", iconOpen=" + iconOpen + ", iconClose="
				+ iconClose + ", children=" + children + ", count=" + count
				+ ", pageSize=" + pageSize + ", pageCount=" + pageCount
				+ ", needSplitPage=" + needSplitPage + "]";
	}

	public String getIconSkin() {
		return iconSkin;
	}

	public void setIconSkin(String iconSkin) {
		this.iconSkin = iconSkin;
	}

}
